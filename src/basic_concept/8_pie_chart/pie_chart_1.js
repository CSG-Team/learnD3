const width = 500;
const height = 500;
const fullAngel = 2 * Math.PI;
const colors = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3.select('body')
  .append('svg')
  .attr('class', 'pie')
  .attr('height', height)
  .attr('width', width)

function render(innerRadius, endAngle){
  if(!endAngle) endAngle = fullAngel;
  const data = [
    { startAngle: 0, endAngle: 0.1 * endAngle },
    { startAngle: 0.1 * endAngle, endAngle: 0.2 * endAngle },
    { startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle },
    { startAngle: 0.4 * endAngle, endAngle: 0.8 * endAngle },
    { startAngle: 0.8 * endAngle, endAngle: 1 * endAngle },
  ];

  const arc = d3.arc()
    .outerRadius(200)
    .innerRadius(innerRadius);

  svg.select('g').remove();
  svg.append('g')
    .attr('transform', 'translate(200, 200)')
    .selectAll('path.arc')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('fill', function(d, i){
      return colors(i);
    })
    .attr('d', function(d, i){
      return arc(d, i)
    })
}

render(100)

