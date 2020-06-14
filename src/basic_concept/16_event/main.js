// d3 event
const r = 300;
const svg = d3.select('body')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)
  .style('border', '1px solid darkgray')


const textEle = svg.append('text')
  .attr('x', 50)
  .attr('y', 50);

console.log('svg', svg)
console.log('svg.node()', svg.node())


svg.on('mousemove', ()=>{
  const positionInfo = d3.mouse(svg.node());
  textEle.text(positionInfo);
})
