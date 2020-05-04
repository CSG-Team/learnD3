function moreTrans(selection) {
  selection.transition().duration(1000)
    .style('width', '200px')
    .style('height', '1px')
    .transition().duration(500)
    .style('left', '600px')
    .transition().duration(1000)
    .style('width', '80px')
    .style('height', '80px');
}

d3.select('body')
  .append('div')
  .attr('class', 'box')
  .style('left', '10px')
  .style('width', '80px')
  .style('height', '80px')
  .call(moreTrans);