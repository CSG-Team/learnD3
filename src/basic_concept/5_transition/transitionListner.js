const body = d3.select('body');
const duration = 3000;

const div = body.append('div')
  .classed('box', true)
  .text('waitting')
  .transition().duration(duration)
  .delay(1000) // 为这个 transition 延迟 1000 
  .on('start', function() {
    d3.select(this).text('doing something...')
  })
  .on('end', function() {
    d3.select(this).text('done')
  })
