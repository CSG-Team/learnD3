
const scale = d3.scaleLinear()
  .domain([1, 10])
  .range([10, 100]);

d3.select('#linear-scale')
  .selectAll('div')
  .data(data) // data已经被定义
  .enter()
  .append('div')
  .classed('one-section', true)
  .text(d =>{
    return scale(d)
  });

