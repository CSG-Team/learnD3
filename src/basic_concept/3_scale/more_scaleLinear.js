let data = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

// 插值字符串尺度
const sizeStringScale = d3.scaleLinear()
  .domain([0, 9])
  .range([
    'italic bold 12px/30px Georgia, serif',
    'italic bold 120px/180px Georgia, serif',
  ]);



d3.select('.textContainer')
  .selectAll('div.textCard')
  .data(data)
  .enter()
  .append('div')
  .classed('textCard', true)
  .text(d => d)
  .style('border', '1px solid #531dab')
  .style('padding', '10px')
  .style('margin', '10px')
  .style('display', 'inline-block')
  .style('font', d =>(sizeStringScale(d)));

data = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];
// 插颜色
const colorScale = d3.scaleLinear()
  .domain([0, 19])
  .range(['#b37feb', 'black'])

d3.select('.colorContainer')
  .selectAll('div.colorCard')
  .data(data)
  .enter()
  .append('div')
  .classed('colorCard', true)
  .text(d => colorScale(d))
  .style('border', '1px solid darkgray')
  .style('color', 'white')
  .style('padding', '10px')
  .style('display', 'inline-block')
  .style('background', d =>(colorScale(d)));



