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

// 所以能被call的函数应该有如下签名
// (section: Section) => {}

// 所以上面这句和下面注释中的等效
  
// const g = svg.append('g')
//   .attr('transform',`translate(${margin}, ${verticalOffset})`);
// axis(g);