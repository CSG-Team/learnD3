const data = [
  'Boy', 'Girl', 'Boy', 'Girl', 'Boy', 'Girl',
];

const duration = 1500;

d3.select('body')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'box')
  .style('top', (d, i) => {
    return i * 40 + 'px';
  })
  .style('left', '500px')
  .text(d => d)
  .transition()
  .duration(duration)
  .style('left', '10px')
  .filter(d => d === 'Boy')
  .transition()
  .duration(duration)
  .style('left', '500px');
