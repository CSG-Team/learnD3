let id = 0;

const data = [];
const duration = 500;
const chartHeight = 100;
const chartWidth = 800;

function render(){
  const selection = d3.select('body')
    .selectAll('div.v-bar')
    .data(data, d => d.id);

  // enter
  selection.enter()
    .append('div')
    .attr('class', 'v-bar')
    .style('z-index', 0)
    .style('position', 'fixed')
    .style('left', (d, i) => {
      return barLeft( i + 1 ) + 'px'
    })
    .style('height', '0px')
    .append('span');

  // update
  selection
    .transition().duration(duration)
    .style('top', d => {
      return chartHeight - barHeight(d) + 'px';
    })
    .style('left', (d, i) => {
      return barLeft(i) + 'px';
    })
    .style('height', d => {
      return barHeight(d) + 'px';
    })
    .select('span')
    .text(d => d.value);

  // exit 
  selection.exit()
    .transition().duration(duration)
    .style('left', (d, i) => {
      return barLeft(-1);
    })
    .remove();

}

function pushData() {
  data.push({
    id: ++ id,
    value:  20 + Math.round(Math.random() * (chartHeight  - 20 )) ,
  });
}

function barLeft(i) {
  return i * ( 30 + 2 );
}

function barHeight (d) {
  return d.value;
}

setInterval(() => {
  data.shift();
  pushData();
  render();

}, 2000)

for (let i = 0; i < 20 ; i ++ ) {
  pushData();
} 
render();
d3.select('bady')
  .attr('class', 'baseline')
  .style('position', 'fixed')
  .style('z-index', 1)
  .style('top', chartHeight + 'px')
  .style('left', '0px')
  .style('width', chartWidth);