// svg create
const width = 700;
const height = 700;
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
  .domain([0, 1900])
  .range([0, paintWidth]);

// axisBottom、axisTop、axisLeft、axisRight、
const axis = d3.axisBottom()
  .scale(scale)
  .ticks(19);  // 刻度个数

// axis 放入组svg : g 中
svg.append('g')
  .attr('class', 'x-axis')
  // 设置绘制时便宜位置
  .attr('transform', `translate(${margin}, ${height - 32})`)
  .call(axis); // call 方法 调用作为参数传入的函数，并以当前选集作为参数

d3.selectAll('g.x-axis g.tick')
  .append('line')
  .classed('grid-line', true)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', -(height -  margin))
  .attr('stroke', 'darkgray');

// 另一个轴
const scale2 = d3.scaleLinear()
  .domain([1900, 0])
  .range([0, height - margin]);
const axisy = d3.axisLeft()
  .scale(scale2)
  .ticks(19)

svg.append('g')
  .attr('class', 'y-axis')
  .attr('transform', `translate(${margin}, ${0})`)
  .call(axisy)

d3.selectAll('g.y-axis g.tick')
  .append('line')
  .classed('grid-line', true)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', width - 2 * margin)
  .attr('y2', 0)
  .attr('stroke', 'darkgray');