# 面积图：堆叠、比例以及流图

## More About Area Chart
还记得之前在谈到面积图的时候，讨论过一种几乎和折线图等价的面积图：
其画法、思路和先前折线图都是一致的。
就是生成path的d属性，之前折线图生成d属性的函数是d3.line(),生成面积图借助的是d3.area()。

但实际上这种面积图并没有太多意义，可能更大意义在于学会了d3.area()方法生成了面积。

现在，是时候讨论下更有意义的面积图了：堆叠、比例以及流图。

### 简介：堆叠面积图
堆叠面积图是将不同数据集合中同一点（x轴）对应的数据铺开展示，这种图从视觉上看，每一组数据就像是叠加在另一组数据之上的。
这样，用户可以看出不同数据间的差异，感知每种数据的占比，以及所有数据的整体走势。



### 简介：比例面积图
比例面积图则是专注于每一种数据的占比情况，所以图的y轴变化范围是[0, 1]（0% ~ 100%）；



### 简介：流图（河流图）
河流图和堆叠面积图其实做了同样的事情：用户可以看出不同数据间的差异，感知每种数据的占比，以及所有数据的整体走势。
但是，河流图的视觉呈现，让人对数据的发展趋势的感知更加清晰。

## D3.js实现
d3.area()方法可以生成path元素的d属性，这个属性就是一个面积，这点依旧是我们的基础。
基于这样我们的代码想必是这样的：
```
selection
  .data(data)
  .enter()
  .append('path')
  .attr('d', (d, i)=>areaFunction(d))

```
不错，这里的思路（伪代码）没问题。
但是上面的代码不能实现一个堆叠的功能，因为，data中的数据还是原始的，未经过处理的。
我们之前讲过布局，布局是一个计算过程，不依赖具体的视觉呈现的计算过程。那么是否可以通过计算来使我们传入data()函数的数据变成处理过的数据呢？
答案呼之欲出了：d3.stack()

stack()函数的返回是一个函数，能帮我们处理这种堆叠的需求，我们的原始数据作为参数传入其返回的函数中，最终得到的返回值就是期望的堆叠的数据：
```js

// 例子 form : https://github.com/d3/d3-shape/blob/v1.3.7/README.md#stacks
const stack = d3.stack()
    .keys(["apples", "bananas", "cherries", "dates"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

const series = stack(data);

```
这里面：
* keys：来设置原始数据中对应要堆叠起来数据的key；
* order: 数据堆叠的顺序，其实一般不用；
* offset:设置的是我们的偏移模式，所谓偏移模式就是按怎样的规则堆叠。

这个函数将原始数据为：
```ts
type IOrigionData = Array<IDataItem>;

type IDataItem = {
  key1: number;
  key2: number;
  // ... more keys
}

```
处理为:
```ts

type IDealedData = Array<IDealedDataItem>;

type IDealedDataItem = {
  0: number;
  1: number;
  data: IDataItem;
}

```
可以看到，处理后的数据的每一项有0, 1, data三个属性；data其实是原始数据，0, 1表示堆叠处理后的下边界和上边界的值。

所以我们基于这种处理过的数据，应该如何应用d3绘制出呢？

```js
// xScale yScale分别表示了 x轴和y轴的尺度
const areaFunc = d3.area()
    .x(function(d, i){ return xScale(i)})
    .y0(function(d){ return yScale(d[0])})
    .y1(function(d){ return yScale(d[1])});

  selection
    .enter()
    // ....
    .attr('d', function(d){
      return areaFunc(d);
    });

```

## 多种类型的面积图Demo
下面的Demo中绘制了堆叠、百分比、流图的面积图,其实不同种类的面积图，核心就是控制d3.stack中的几种各种参数，代码如下：
```js
// 基本设置
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


renderCommon();

// 普通面积图
function renderCommon() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOrderNone  );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}

// 堆叠面积图
function renderStack() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOffsetNone );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 28])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}

// 百分比面积图
function renderStackPercent() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOffsetExpand );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    // .domain([0, 20])
    .domain([0, 1])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}

// 流图
function renderRiver() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .order(d3.stackOrderInsideOut)
  .offset(d3.stackOffsetWiggle)

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([-30, 50])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  }, false);
}


function renderData(data, scaleSetting, renderYAxes = true) {
  const {
    xScale, yScale
  } = scaleSetting;
  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  renderAxis(xScale, yScale, renderYAxes);
  renderClipPath(svg);

  if(!chart_g){
    chart_g = svg.append('g')
      .attr('class', 'body')
      .attr("transform", "translate("
        + x_start + ","
        + y_end + ")")  
      .attr("clip-path", "url(#body-clip)");
  }
  chart_g.selectAll('path.line')
    .merge(chart_g.selectAll('path.area'))
    .remove();

  renderArea(data, scaleSetting);
  renderLines(data, scaleSetting);

}


function renderLines (data, scaleSetting) {
  console.log('renderLines ... s')
  const {
    xScale, yScale,
  } = scaleSetting;
  const lineFunc = d3.line()
    .x(function(d, i){ return xScale(i)})
    .y(function(d){ return yScale(d[1])});

  const pathLines = chart_g.selectAll('path.line')
    .data(data);
  pathLines
    .enter()
    .append('path')
    .merge(pathLines)
    .attr('class', 'line')
    .style('stroke', function(d, i){
      return colors(i);
    })
    .style('line-width', 2)
    .transition()
    .attr('d', function(d){
      console.log('draw line ', d)
      return lineFunc(d);
    });
}


function renderArea (data, scaleSetting) {
  const {
    xScale, yScale,
  } = scaleSetting;
  const areaFunc = d3.area()
    .x(function(d, i){ return xScale(i)})
    .y0(function(d){ return yScale(d[0])})
    .y1(function(d){ return yScale(d[1])});

  const pathAreas = chart_g.selectAll('path.area')
    .data(data);
  pathAreas
    .enter()
    .append('path')
    .merge(pathAreas)
    .style('stroke', function(d, i){
      return colors(i);
    })
    .style('fill', function(d, i){
      return colors(i);
    })
    .style('opacity', 0.3)
    .attr('class', 'area')
    .transition()
    .attr('d', function(d){
      return areaFunc(d);
    });
}

function renderClipPath(svg){
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

function renderAxis(xScale, yScale, renderYAxes) {
  d3.selectAll('.x_axis').remove();
  d3.selectAll('.y_axis').remove();
  d3.selectAll('g.x_axis g.tick').selectAll('.grid-line').remove();
  d3.selectAll('.grid-line').remove();


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

  const yAxis = d3.axisLeft()
    .scale(yScale);

  if(renderYAxes){
    axis_g.append('g')
    .attr('class', 'y_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_end + ')' 
    })
    .call(yAxis);
  }
  return true;

}

```

更多相关的API，参见[官网链接](https://github.com/d3/d3-shape/blob/v1.3.7/README.md#stacks)
