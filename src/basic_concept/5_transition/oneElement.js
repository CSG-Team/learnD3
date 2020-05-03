const body = d3.select('body');
const duration = 5000; // 持续时间

body.append('div')
  .classed('myDiv', true)
  .style('background-color', 'red')
  .transition()
  .duration(duration)
  .style('background-color', 'blue')
  .style('margin-left', '600px')
  .style('width', '100px')
  .style('height', '100px');

