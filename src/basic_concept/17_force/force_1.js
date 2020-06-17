const width = 1000;
const height = 1000;
const r = 4;
const nodes = [];

const force = d3.forceSimulation()
  .velocityDecay(0.8)
  .alphaDecay(0)
  .force('collision', d3.forceCollide(r + 0.5).strength(1));

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px dashed #333');

force.on('tick', ()=>{
  svg.selectAll('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
});

svg.on('mousemove', function() {
  const point = d3.mouse(this)
  const node = {
    x: point[0],
    y: point[1],
  };
  svg.append('circle')
    .data([node])
    .attr('class', 'node')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 1e-6)
    .style('fill', randomColor() )
    .transition()
    .attr('r', r)
    .transition()
    .delay(6000)
    .duration(700)
    .attr('r', 60)
    .style('fill', 'transparent')
    .on('end', function(){
      nodes.shift();
      force.nodes(nodes);
    });
    nodes.push(node);
    force.nodes(nodes);

});

