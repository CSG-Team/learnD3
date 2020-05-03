const data = [
  {name: 'Linear', easeFnction: d3.easeLinear },
  {name: 'Cubic', easeFnction: d3.easeCubic },
  {name: 'CubicIn', easeFnction: d3.easeCubicIn },
  {name: 'Sin', easeFnction: d3.easeSin },
  {name: 'SinIn', easeFnction: d3.easeSinIn },
  {name: 'Exp', easeFnction: d3.easeExp },
  {name: 'Circle', easeFnction: d3.easeCircle },
  {name: 'Back', easeFnction: d3.easeBack },
  {name: 'Bounce', easeFnction: d3.easeBounce },
  {name: 'Elastic', easeFnction: d3.easeElastic },
  {name: 'Custom', easeFnction: t => t * t * t * t },
];

const colors = d3.scaleOrdinal(d3.schemeCategory20);

d3.select('body').selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'cell')
  .style('top', (d, i) => {
    return 40 * i + 'px';
  })
  .style('background-color', (d, i) => colors(i))
  .style('color', 'white')
  .style('left', '500px')
  .style('width', '100px')

  .text(d => d.name);

d3.selectAll('div').each( function(d) {
  d3.select(this)
    .transition()
    .ease(d.easeFnction)
    .duration(2000)
    .style('left', '10px')
});

