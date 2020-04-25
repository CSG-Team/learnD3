# 绘制坐标轴
坐标轴是常用的可视化组件。D3为此提供了简单的方法，帮助我们快速绘制坐标轴。坐标相关的[API](https://github.com/d3/d3/blob/master/API.md?_blank#axes-d3-axis)也相对简单。

## [API](https://github.com/d3/d3/blob/master/API.md?_blank#axes-d3-axis)
* 坐标位置 这里的坐标位置是指的不是将坐标轴绘制在什么地方，而是绘制一个将要在什么位置出现的坐标轴，但是实际位置还是从左上角。比如说，axisTop这种坐标轴，是要在顶部用的，所以刻度文字都在坐标轴线的上面。这就是文档中说的Top Oriented Axis。
共有四种：
* d3.axisTop
* d3.axisRight
* d3.axisBottom
* d3.axisLeft

* 尺度
[API](https://github.com/d3/d3-axis/blob/v1.0.12/README.md#axis_scale)
坐标轴需要配合先前的尺度scale一起才能使用。这里尺度的具体意义是domain代表了坐标轴上面的刻度范围，而range代表了坐标轴实际的长度。


* 刻度设置
刻度设置最基础的ticks，它用来设置需要绘制多少个刻度。
其他的一些比如设置刻度显示格式、刻度大小等，参见[API](https://github.com/d3/d3-axis/blob/v1.0.12/README.md#axis_ticks)

## DEMO
绘制一个最基本的坐标轴：
```js
// svg create
const width = 500;
const height = 500;
const margin = 32;
const paintWidth = width - 2 * margin;
const verticalOffset = 100;

// d3的坐标轴需要svg支持
const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// 坐标轴通过尺度映射刻度
const scale = d3.scaleLinear()
  .domain([0, 1000])
  .range([0, paintWidth]);

// axisBottom、axisTop、axisLeft、axisRight、
const axis = d3.axisBottom()
  .scale(scale)
  .ticks(5);  // 刻度个数

// axis 放入组svg : g 中
svg.append('g')
  // 设置绘制时便宜位置
  .attr('transform',`translate(${margin}, ${verticalOffset})`)
  .call(axis); // call 方法 调用作为参数传入的函数，并以当前选集作为参数

```
上面代码首先构造了一个SVG元素，设置了它尺寸。而后构建了一个scale，设置映射规则后，构造axis，将scale和tick设置进去后。
在svg上构造组标签g（一般组在svg都用g表示）。然后利用translate属性移动坐标轴，这里就是g。
因为此时选定的选集是svg中的g，所以后面的一句有必要解释下call。
被call的函数应该有如下签名：(section: Section) => {}，所以上面这句和下面注释中的等效
```js
  const g = svg.append('g')  
  .attr('transform',`translate(${margin}, ${verticalOffset})`)
  ;axis(g);
```

## 极坐标
D3没有现成绘制极坐标的方法，后续只能通过绘制图形，自己应用图形慢慢花了.

