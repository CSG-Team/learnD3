# 散点图
这种图表，用多组数据构成多个坐标点，考察坐标点的分布，判断两变量之间是否存在某种关联或总结坐标点的分布模式。

散点图的思路略有不同，当然总体思路还是生成path的d属性，但是散点图的d属性是个图形而已，自身的形状与数据并为关联。
那么散点图各个点的位置如何确定？答案是借助translate属性，而translate移动的距离是可以和数据关联的。
下面的代码就是一个完整的散点图的DEMO。
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


    // lines
    if(!chart_g){
      chart_g = svg.append('g')
        .attr('class', 'body')
        .attr("transform", "translate("
          + x_start + ","
          + y_end + ")")  
        .attr("clip-path", "url(#body-clip)");
      }

      data.forEach((list, i) => {
        chart_g.selectAll("path._" + i)
          .data(list)
          .enter()
          .append("path")
          .attr("class", "symbol _" + i);
        
        // 这里最重要
        chart_g.selectAll("path._" + i)
          .data(list)
          .classed(symbolTypes(i), true)
          .transition() 
          // 借助translate
          .attr("transform", function(d){
            return "translate("  
              + xScale(d.x) 
              + "," 
              + yScale(d.y) 
              + ")";
            })
            .attr("d", 
              d3.symbol()  
                .type(()=>{ return d3.symbols[i]})
            ); 

          chart_g.selectAll("path._" + i)
            .data(list)
            .exit()
            .remove();
          })

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

const numberOfSeries = 5,
  numberOfDataPoint = 11;
let data = [];

function randomData() {
  return Math.random() * 9;
}

function genData(){
  data = [];
  for (var i = 0; i < numberOfSeries; ++i){
    data.push(d3.range(numberOfDataPoint).map(function (i) {
      return {x: randomData(), y: randomData()};
  }));
  }
  
}
genData();

render(data);

function repeat(){
  genData();
  render(data)
}

setInterval(repeat, 1000)
```

上面代码中整体结构和之前的linechart， areachart是一致的。其中需要注意的就是上面说的思路：借助translate来确定点的位置。
```js
  .attr("transform", (d) => {
    return "translate("  
      + xScale(d.x) 
      + "," 
      + yScale(d.y) 
      + ")";
    })
    .attr("d", 
      d3.symbol()  
        .type(()=>{ return d3.symbols[i]})
    ); 

```

d3.symbol().type()就是生成散点的不同形状，具体的形状是：
circle, cross, diamond, square, star, triangle, wye，7种形状;
![散点的不同形状](http://img.suoniao.com/FpE1zDMaetv6IQvDyoc2H26_1s6a)
如下图；对应d3.symbols[i]中i代表的 0,1,2,3,4,5,6;
