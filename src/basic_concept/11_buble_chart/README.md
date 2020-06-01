# Bubble Chart

>气泡图（bubble chart）是可用于展示三个变量之间的关系。它与散点图类似，绘制时将一个变量放在横轴，另一个变量放在纵轴，而第三个变量则用气泡的大小来表示。排列在工作表的列中的数据（第一列中列出 x 值，在相邻列中列出相应的 y 值和气泡大小的值）可以绘制在气泡图中。气泡图与散点图相似，不同之处在于：气泡图允许在图表中额外加入一个表示大小的变量进行对比。

上面是一段气泡图定义的引用。说到底，气泡图表现的是一组三维数据的对比和分布。
再继续下去之前，我觉得我有必要复习下到目前为止，使用d3做可视化图表的几个思路：
1. 借助图形生成器，生成可用于path对象的d属性，比如折线图、面积图、简易的饼图；
2. 将数据映射成基础图形的属性，比如形状、位置等，散点图和我们接下来研究的气泡图；

气泡图的思路其实很简单，我们假设我们已经映射好了数据对应的x，y，以及气的大小三个维度。（这个映射就是从问题空间到解空间的转化过程，比如，我像知道NBA super star的投篮倾向、扣篮倾向以及场均得分，那么可以这么设计，x表示投篮倾向，y表示扣篮倾向，而每一个“气泡”的半径表示场均得分，那么，这个思维过程就是映射，我们把(投篮倾向，扣篮倾向，场均得分)--->（x, y, r））

结合代码看下：

```js

const width = 600;
const height = 600;
const margins = {
  top: 30,
  left: 30,
  bottom: 30,
  right: 30,
};
const colors = d3.scaleOrdinal(d3.schemeCategory10);

const draw_width = width - margins.left - margins.right;
const draw_height = height - margins.top - margins.bottom;

const x_start = margins.left;
const y_start = height - margins.bottom;
const y_end = margins.top;

let svg, chart_g;

let isFirstRendered = false;

const symbolTypes = d3.scaleOrdinal()
.range([
  "circle",
  "cross",
  "diamond",
  "square",
  "triangle-down",
  "triangle-up",
  ]);

function render(data){
  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  const xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([draw_height, 0]);
  
  // axis render
  if(!isFirstRendered){
    isFirstRendered = renderAxis(xScale, yScale);

    let padding = 5;

    svg.append("defs")
      .append("clipPath")
      .attr("id", "body-clip")
      .append("rect")
      .attr("x", 0 - padding)
      .attr("y", 0)
      .attr("width", draw_width+ 2 * padding)
      .attr("height", draw_height);
  }


    if(!chart_g){
      chart_g = svg.append('g')
        .attr('class', 'body')
        .attr("transform", "translate("
          + x_start + ","
          + y_end + ")")  
        .attr("clip-path", "url(#body-clip)");
      }

    const bubble = chart_g.selectAll(".bubble")
      .data(data)
  
    bubble.enter()
      .append('circle')
      .merge(bubble)
      .attr('class', 'bubble')
      .attr('stroke', (d, i)=>{
        return '#fa8c16'
      })
      .attr('stroke-width', 3)
      .attr('fill', 'rgba(0,0,0,0.35)')
      .transition() 
      .attr('cx', (d, i)=> xScale(d.x) )
      .attr('cy', (d, i)=> yScale(d.y) )
      .attr('r', (d, i)=> d.r * 5 );

      console.log('in exit', bubble.exit())

    bubble
      .exit()
      .attr('stroke', (d, i)=>{
        return '#096dd9'
      })
      .transition() 
      .duration(1200)
      .attr('r', function(d){
        console.log('d3.select(this)', d3.select(this))
        return d3.select(this).attr('r') * 3;
      })
      .transition() 
      .duration(600)
      .attr('r', 0)
      .remove();
  
}


function renderAxis(xScale, yScale) {
  const axis_g = svg.append('g')
    .attr('class', 'axis');

  const xAxis = d3.axisBottom()
    .scale(xScale);
  axis_g.append('g')
    .attr('class', 'x_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_start + ')' 
    })
    .call(xAxis);

  d3.selectAll("g.x_axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - draw_height)
    .attr('stroke', 'lightgray');

  const yAxis = d3.axisLeft()
    .scale(yScale);
  axis_g.append('g')
    .attr('class', 'y_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_end + ')' 
    })
    .call(yAxis);

  d3.selectAll("g.y_axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", draw_width)
    .attr("y2", 0)
    .attr('stroke', 'lightgray');

  return true;


}


const numberOfDataPoint = 10;
let datax = [];

function randomData() {
  return Math.random() * 9;
}

function genData(){
  datax = [];
  for (var i = 0; i < numberOfDataPoint; i++){
    datax.push({
      x: randomData(), 
      y: randomData(), 
      r: randomData(),
    });
  }
  
}
genData();


render(datax);

let repeatTime = 0;

function repeat(){
  // genData();
  // datax.shift()
  if(repeatTime % 3 === 0 ){
    datax.pop();
    datax.pop();

  }
  datax.push({
    x: randomData(), 
    y: randomData(), 
    r: randomData(),
  })
  render(datax)

  repeatTime++;
}

setInterval(repeat, 3000)
```
这段代码真正核心的地方是这里：（全贴下来是方便copy）

```js

    const bubble = chart_g.selectAll(".bubble")
      .data(data)
  
    bubble.enter()
      .append('circle')
      .merge(bubble)
      .attr('class', 'bubble')
      .attr('stroke', (d, i)=>{
        return '#fa8c16'
      })
      .attr('stroke-width', 3)
      .attr('fill', 'rgba(0,0,0,0.35)')
      .transition() 
      .attr('cx', (d, i)=> xScale(d.x) )
      .attr('cy', (d, i)=> yScale(d.y) )
      .attr('r', (d, i)=> d.r * 5 );

      console.log('in exit', bubble.exit())

    bubble
      .exit()
      .attr('stroke', (d, i)=>{
        return '#096dd9'
      })
      .transition() 
      .duration(1200)
      .attr('r', function(d){
        console.log('d3.select(this)', d3.select(this))
        return d3.select(this).attr('r') * 3;
      })
      .transition() 
      .duration(600)
      .attr('r', 0)
      .remove();
```
这里其实使用了经典的 enter - update - exit 模式。可以看到，在更新和进入阶段我们的操作就是构造一个基础图形circle，然后根据数据设置其半径；
在退出状态也设置了一个简单的退出动画。
最终代码的效果就是这样：


