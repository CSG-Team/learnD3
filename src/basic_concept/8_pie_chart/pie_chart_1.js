const width = 500;
const height = 500;
const margin = 50;


const x = d3.scaleLinear()
  .domain([0, 10])
  .range([margin, width - margin]);

const y = d3.scaleLinear()
  .domain([0, 10])
  .range([height - margin, margin]);

const data = [
  [  
    { x: 0, y: 5 }, 
    { x: 1, y: 9 }, 
    { x: 2, y: 6 }, 
    { x: 3, y: 3 }, 
    { x: 4, y: 2 }, 
    { x: 5, y: 8 }, 
    { x: 6, y: 7 }, 
    { x: 7, y: 4 }, 
    { x: 8, y: 1 }, 
    { x: 9, y: 3 }, 
  ]
];

// 这里的line是一个生成函数
// 其输入是一个数组
// 输出是是一串可以被设置为 path中d属性值的字符串
const line = d3.line() // <-D
  .x(function(d){return x(d.x);})
  .y(function(d){return y(d.y);})
  // curve可以设置多种线条插补样式
  // .tension属性更是可以接受一个0-1的值用来确定进一步的弯曲程度
  .curve(d3.curveBasis);

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg.selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('class', 'line')
  .attr('d', d=>{
    return line(d)
  });

// render axis 
const axis = d3.axisBottom()
  .scale(x)
  .ticks(10);  // 刻度个数

// axis 放入组svg : g 中
svg.append('g')
  // 设置绘制时便宜位置
  .attr('transform',`translate(${0}, ${height - margin})`)
  .call(axis); // call 方法 调用作为参数传入的函数，并以当前选集作为参数
