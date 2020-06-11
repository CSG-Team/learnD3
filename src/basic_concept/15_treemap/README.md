# 树结构的可视化
树，属于一种关系结构，是由多个子对象组成的一个对象和关系的集合。
树包含的的关系比较简单：在树中的任意一个非根节点只能有一个父节点。通常用来表现从属，单向依赖或者包含关系。
在数据可视化中，标准的树结构数据大多采取一下形式：

```ts
type INode = {
  children?: Array<Inode>;
  [propsName: string]: any;
};

```
children中是一个节点的数组，这样其实数据是一个嵌套起来的大对象。

数图常见的数据可视化手段有：矩形树图、树图、包图；它们各有各的侧重点：
* 矩形树图除了展示层次信息外，通过大小不等的面积色块还能展示占比信息；所以关注点在占比方面，但是矩形图之渲染叶子节点；
* 树图展示从属依赖关系十分清晰；
* 包图综合了上面两种图的特点，又能反应关系，又能反应占比，可是每个方面单独却不如上面两种图各自擅长的效果。


## 矩形树图

先看代码：
```js
// 基本设置
const width = 1600;
const height = 800;

const colors = d3.scaleOrdinal(d3.schemeCategory10);

let svg, chart_g, treemap_g;

renderData(tree_map_data, d=>d.size)

function renderData(data, valueAccessor) {

  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  if(!chart_g){
    chart_g = svg.append('g')
      .attr('class', 'body');

    treemap_g = d3.treemap()
      .size([width, height])
      .round(true)
      .padding(1);
  }

  const root = d3.hierarchy(data)
    .sum(valueAccessor)
    .sort((a, b) => b.value - a.value);

  treemap_g(root);

  const cells = chart_g.selectAll('g')
    .data(root.leaves())

  renderCells(cells);

}

function renderCells(cells) {
  const cellEnter = cells.enter()
    .append('g')
    .merge(cells)
    .attr('class', 'cell')
    .attr('transform', d=>{
      return `translate(${d.x0}, ${d.y0})`
    });

  renderRect(cellEnter, cells);
  renderText(cellEnter, cells);
  cells.exit().remove();

}

function renderRect(cellEnter, cells) {
  cellEnter.append("rect");

  cellEnter.merge(cells)
    .transition()
    .select("rect")
    .attr("width", function (d) { 
        return d.x1 - d.x0;
    })
    .attr("height", function (d) {
        return d.y1 - d.y0;
    })
    .style("fill", function (d) {
      // 保证相同的自负床分类
      // 相同的颜色一致 
      return colors(d.parent.data.name); 
    });
}

function renderText(cellEnter, cells) {
  cellEnter.append("text");

  cellEnter.merge(cells)
    .select("text") //<-H
    .style("font-size", 11)
    .attr("x", function (d) {
        return (d.x1 - d.x0) / 2;
    })
    .attr("y", function (d) {
        return (d.y1 - d.y0) / 2;
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data.name;
    })
    .style("opacity", function (d) {
        d.w = this.getComputedTextLength();
        return d.w < (d.x1 - d.x0) ? 1 : 0; //<-I
    });
}

```
上述代码解释几个关键点就没有难度了。
1. d3.treemap()通过设置尺寸和边距，它返回一个用来生成矩形尺寸的函数。d3.hierarchy()将原始数据设置成标准的层次数据。这个数据再交给d3.treemap()原先返回的函数，会在这个层次数据上添加位置信息。：
```js
treemap_g = d3.treemap()
  .size([width, height])
  .round(true)
  .padding(1);

const root = d3.hierarchy(data)
  .sum(valueAccessor)
  .sort((a, b) => b.value - a.value);

treemap_g(root);
```
而最终生成的数据都包含这些属性：
* depth:节点深度
* height：节点的高度

* value:表示子树的值的总和
* x0, x1, y0, y1：表示矩形在图中的位置
另外，在进入enter-update-exit模式之前，设置数据我们用了：
```js
root.leaves()

```
这个方法得到了所有叶子节点，并返回一个数组形式的数据，我们后面的renderRect要使用这个数据。
后面的逻辑就是将这些盒子（rect）渲染出来，以及没有难点了。

## 树图
我们想要改变树的形状，d3.hierarchy(data)生成了标准树结构，这一步和形状没有关系，是任何形状都需要的一步。这里需要做的就是使用树的布局函数。
```js
d3.tree()
  .size([ 
    (height - marginTop - marginBottom), // tree 默认是纵向的 所以这里是 y, x
    (width - marginLeft - marginRight),
  ]);
```
这里需要注意的是，size设置的是tree布局的整体计算尺寸。然而，和我们常规理解不同的一点是这里size传入的是[height, width] 而不是 [width, height]，这是因为默认的tree布局是纵向的。
d3.tree()返回的是一个函数，他接受标准的层级数据，并给它设置位置：x, y属性赋值。

下面要做的就是将带有位置信息的数据绘制出来，自然而然的，我们使用update-enter-exit模式。
这里需要说明的一点是，为什么要transform？元素被transform之后，自身的绘制原点会改变，这时候再绘制其他图形的时候，基于新的原点，比较方便。

tree布局是纵向的，但是我们想得到一张横向的图，最简单的方法是x，y位置信息互换，即，P(x, y)变成P(y,x)。所以我们这里的transform是
```js
  .attr('transform', (d)=>{
    return `translate(${d.y}, ${d.x})`
  });
```

完整代码这里贴出如下：

```js
// 基本设置
const width = 1000;
const height = 1000;
const marginTop = 30;
const marginBottom = 30;
const marginLeft = 50;
const marginRight = 30;
const TIME_DURATION = 500;

const colors = d3.scaleOrdinal(d3.schemeCategory10);

let svg, chart_g, tree_g;

renderData(tree_map_data,)

function renderData(data, ) {

  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }


  if(!chart_g){
    chart_g = svg.append('g')
      .attr('class', 'body')
      .attr("transform", function (d) {
        return "translate(" + marginLeft
                + "," + marginTop+ ")";
    });

    tree_g = d3.tree()
      .size([
        (height - marginTop - marginBottom), // tree 默认是纵向的 所以这里是 y, x
        (width - marginLeft - marginRight),
      ]);
  }

  const root = d3.hierarchy(data)

  tree_g(root);

  renderNodes(root);

  renderDataEdges(root);


}

function renderNodes(root) {
  // 层级中所有节点
  const nodes = root.descendants();
  const nodesElement = chart_g.selectAll('g.node')
    .data(nodes, (d) => {
      return d.id
    })
  
  const nodesEnter = nodesElement.enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d)=>{
      return `translate(${d.y}, ${d.x})`
    })
    .on('click', (d)=>{
      console.log("Click")
      toggle(d)
      renderData(root)

    });

  nodesEnter.append('circle')
    .attr('r', 2.5)
    // .attr('cx', 0)
    // .attr('cy', 0)
    .attr('stroke', 'darkgray')
    .attr('fill', 'blue');


  const nodesUpdate = nodesEnter
    .merge(nodesElement)
    .transition()
    .duration(TIME_DURATION)
    .attr('transform', (d)=>{
      return `translate(${d.y}, ${d.x})`
    });


    nodesUpdate.select('circle')
      .style('fill', (d) => {
        return d._children ? 'lightsteelblue' : '#fff'
      })
    
    const nodeExit = nodesElement.exit()
      .transition().duration(TIME_DURATION)
      .attr('transform', (d)=>{
        return `translate(${d.y}, ${d.x})`
      })
      .remove();
    renderLabels(nodesEnter, nodesUpdate, nodeExit);
}

function renderLabels(nodeEnter, nodeUpdate, nodeExit) {
  nodeEnter.append("text")
    .attr("x", function (d) {
        return d.children || d._children ? -10 : 10; // <-K
    })
    .attr("dy", ".15em")
    .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start"; // <-L
    })
    .text(function (d) {
        return d.data.name;
    })
    .style("font-size", '0.65em');

 nodeUpdate.select("text")
    .style("fill-opacity", 1);

 nodeExit.select("text")
    .style("fill-opacity", 1e-6)
    .remove();
}

function renderDataEdges(root){
  const nodes = root.descendants().slice(1);
  console.log('nodes --', nodes.slice(1));
  const edge = chart_g.selectAll('path.edge')
    .data(nodes, (d) => {
      return d.id;
    });
  
  edge.enter().insert('path', 'g')
    .attr('class', 'edge')
    .transition()
    .duration(TIME_DURATION)
    .attr('d', (d) => {
      console.log("d in edge ->", d)
      // console('genEdgePath(d, d.parant)', genEdgePath(d, d.parant))
      return genEdgePath(d, d.parent)
    })
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    ;

  edge.exit().remove();
}

// 在两个点之间 生成贝塞尔曲线
function genEdgePath(target, source) {

  const path = d3.path();
  path.moveTo(target.y, target.x);
  path.bezierCurveTo((target.y + source.y) / 2, target.x,
    (target.y + source.y) / 2, source.x, source.y, source.x);
  return path.toString();
}
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
```
上面代码中还需要说的一点是，我们生成边的时候利用了d3.path()帮助我们生成贝塞尔曲线。

另外，还有一种将树图布局成圆环状的树图，d3中其实也有相关方法，其思路实际上和上文中思路一致, 核心的部分还是，d3.tree()布局函数，相对坐标原点转换，边的生成等要素。这里不贴代码了，参见代码库。


## 包图
包图类似学习集合的时候的韦恩图。
要绘制这种图表，核心还是计算位置信息，和前面思路一样：
得到标准层次信息：
```js
const valueAccessor = d => d.size;
const root = d3.hierarchy(data)
  .sum(valueAccessor)
  .sort((a, b) => {
    return b.value - a.value;
  })

```

使用布局函数，计算几何信息：

```js
tree_g = d3.pack()
  .size([width, height]);
tree_g(root);

```
我们使用d3.pack()就构造了包图的布局函数。使用这个布局函数，可以在标准层级数据中，添加x， y， r属性，显然，这些属性就是绘制包图的关键。完整代码在代码仓库中。

