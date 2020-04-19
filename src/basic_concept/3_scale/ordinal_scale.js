
const max = 10;
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 字符映射
const wordScale = d3.scaleOrdinal()
  .domain(data)
  .range(['H', 'e', 'l', 'l', 'o', 'w', 'D','3','j','s',]);

const colorScale20b = d3.scaleOrdinal(
  d3.schemeCategory20b
);


const myColors = [
  '#8c8c8c', '#722ed1', '#2f54eb',
  '#1890ff', '#13c2c2', '#52c41a',
  '#faad14', '#fadb14', '#d4380d',
  '#ff85c0', 

];
const colorScaleMine = d3.scaleOrdinal()
  .domain(data)
  .range(myColors);

function render(data, selector, scale) {
  d3.select(selector)
    .selectAll('div.section')
    .data(data)
    .enter()
    .append('div')
    .classed('section', true)
    .style('background', d=>{
      return scale(d).indexOf('#') > -1 ? scale(d) : 'white'
    })
    .text(d=>{
      return scale(d);
    })

}

