

// 更多实例
const linerScale = d3.scaleLinear()
  .domain([1, 10])
  .range([33, 66]);

const powScaleSimple = d3.scalePow()
  .exponent(3); // 指数


const powScale = d3.scalePow()
  .exponent(3) // 指数
  .domain([1, 10])
  .range([10, 100]);

const logScale = d3.scaleLog()
  .domain([1, 10])
  .range([10, 100])


function renderScale(data, scale, selector) {

  d3.select(selector)
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    // .classed('one-section', true)
    .text(d =>{
      return scale(d)
    });
}
