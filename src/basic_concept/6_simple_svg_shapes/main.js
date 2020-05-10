const width = 800, height = 500;

const svg = d3.select('body')
  .append('svg');


svg.attr('width', width)
  .attr('height', height);

// line element
svg.append('line')
  .attr('x1', 10)
  .attr('y1', 10)
  .attr('x2', 100)
  .attr('y2', 200)
  .style('stroke', 'red')
  .style('stroke-width', '2px');

svg.append('text')
  .text('line')
  .attr('x', 50)
  .attr('y', 300);

// circle element
svg.append('circle')
  .attr('cx', 250)
  .attr('cy', 150)
  .attr('r', 40)
  .style('fill', 'transparent')
  .style('stroke', 'blue');

svg.append('text')
  .text('circle')
  .attr('x', 230)
  .attr('y', 300);

// rect element
svg.append('rect')
  .attr('x', 400)
  .attr('y', 120)
  .attr('rx', 5)
  .attr('width', 50)
  .attr('height', 50);

svg.append('text')
  .text('rect')
  .attr('x', 410)
  .attr('y', 300)
  ;

svg.append('polygon')
  .attr('points', '570,80 530,150 650,220')
  .style('fill', 'transparent')
  .style('stroke', 'blue')
  .style('stroke-width', '2px');

svg.append('text')
  .text('polygon')
  .attr('x', 580)
  .attr('y', 300);


