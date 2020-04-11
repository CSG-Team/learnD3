function change_h1() {
  d3.select('.myClass1')
    .select('h1')
    .text('Hello D3.js~~~~')
    .style('font-size', '60px')
    .style('color', 'red');

}

function insert_div_rect() {
  console.log('insert_div_rect')
  d3.select('.rect-container')
    .html('<div class="rect"></div>')
    .select('.rect')
    .style('width', '300px')
    .style('height', '500px')
    .style('background-color', 'green');

}