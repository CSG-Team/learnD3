# Area Chart
第一种面积图类似折线图，表现数值的趋势。
而另一种折线图更加凸显不同类型数据的差异，这种差异用面积更能表现，这种图用d3完成的话需要借助布局。

## 类似折线图的面积图
其实画法、思路和先前折线图都是一致的。
就是生成path的d属性，之前折线图生成d属性的函数是d3.line(),生成面积图借助的是d3.area()。下面代码对折线图做了一点修改，就变成了面积图。
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

    // const lineFunc = d3.line()
    //   .x(function(d){ return xScale(d.x)})
    //   .y(function(d){ return yScale(d.y)})

    const areaFunc = d3.area()
      .x(function(d){ return xScale(d.x)})
      .y0(y_start)
      .y1(function(d){ return yScale(d.y)})
      // .curve(d3.curveBasis);

    const pathLines = chart_g.selectAll('path.line')
      .data(data);
    pathLines
      .enter()
      .append('path')
      .merge(pathLines)
      .style('stroke', function(d, i){
        return colors(i);
      })
      .style('fill', function(d, i){
        return 'rgba(0, 0, 0, 0.25)';
      })
      .attr('class', 'line')
      .transition()
      .attr('d', function(d){
        return areaFunc(d);
      });


    // render dot circle 
    data.forEach(function (oneList, i) {
      var circle = chart_g.selectAll("circle._" + i)  
        .data(oneList);

      circle.enter()
        .append("circle")
        .merge(circle)
        .attr("class", "dot _" + i)
        .style("stroke", function (d) {
          return colors(i);  
        })
        .style('fill', 'white')
        .transition()  
        .attr("cx", function (d) { return xScale(d.x); })
        .attr("cy", function (d) { return yScale(d.y); })
        .attr("r", 4.5);
    });


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

let data = [{x: 0, y: 5}, {x: 1, y: 5},{x: 2, y: 5}];
const MAX_COUNT = 10;
function pushData(){
  if(data.length > MAX_COUNT){
    data.shift();
  }
  const newData = data.map((item, index) => {
    return {
      x: index,
      y: item.y
    }
  });
  newData.push({
    x: data.length,
    y: Math.ceil(Math.random() * 10)
  })

  data =  newData;
}



render([data]);

function repeat(){
  pushData();
  render([data])
}

setInterval(repeat, 1000)

```
代码修改的地方是：

```
// 折线图
// const lineFunc = d3.line()
//   .x(function(d){ return xScale(d.x)})
//   .y(function(d){ return yScale(d.y)})

// 面积图
const areaFunc = d3.area()
  .x(function(d){ return xScale(d.x)})
  .y0(y_start)
  .y1(function(d){ return yScale(d.y)})

```


