const width = 960, height = 500, r = 50;

const data = [
  [width / 2 - r, height / 2 - r],
  [width / 2 - r, height / 2 + r],
  [width / 2 + r, height / 2 - r],
  [width / 2 + r, height / 2 + r]
];

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid gray')
  .append('g')

const drag = d3.drag()
  .on('drag', move)

svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', r)
  .style('fill', 'yellow')
  .attr('transform', d => `translate(${d})`)
  .call(drag);


function move(d) {
  const x = d3.event.x,
        y = d3.event.y;
  if(notOverBound(x, y)){
    d3.select(this)
      .attr('transform', `translate(${x}, ${y})`)
  }
}

function notOverBound(x, y){
  return ((x >= 0 + r) && (x <= width - r)) &&
    ((y >= 0 + r) && (y <= height - r))

}


