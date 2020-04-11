function change_h1() {
  d3.select('.myClass1')
    .select('h1')
    .text('Hello D3.js~~~~')
    .style('font-size', '60px')
    .style('color', 'red');
}

function insert_div_rect() {
  d3.select('.rect-container')
    .html('<div class="rect"></div>')
    .select('.rect')
    .style('width', '300px')
    .style('height', '500px')
    .style('background-color', 'green');
}

function append_child() {
  d3.select('.to-be-append')
    .attr('class', 'append-div')
    .text('Grandpa')
    .style('font-size', '40px')
    .style('width', '300px')
    .style('height', '500px')
    .style('background-color', 'yellow')
    .append('div')
    .attr('class', 'append-div')
    .text('Father')
    .style('font-size', '30px')
    .style('color', 'white')
    .style('width', '200px')
    .style('height', '300px')
    .style('background-color', 'red')
    .append('p')
    .attr('class', 'append-div')
    .text('Son')
    .style('font-size', '15px')
    .style('color', 'white')
    .style('width', '100px')
    .style('height', '200px')
    .style('background-color', 'blue');
  
    d3.selectAll('.append-div')
      .style('border', 'solid 1px black');

}