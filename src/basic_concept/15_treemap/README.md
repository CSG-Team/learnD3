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

  console.log('root', root);
  console.log('root leaves()', root.leaves())


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
To Be Continued...

## 包图
To Be Continued...


