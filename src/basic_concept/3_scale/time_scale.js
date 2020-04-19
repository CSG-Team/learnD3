const start = new Date(2020, 0, 1);
const end = new Date(2020, 11, 31);
const timeScale = d3.scaleTime()
  .domain([start, end])
  .rangeRound([0, 1200]); // rangeRound与range的不同是：映射后取整
const max = 12;
const data = [];

// 构造date
for (let i = 0; i < max; i++ ) {
  let date = new Date(start.getTime());
  date.setMonth(start.getMonth() + i);
  data.push(date);
}
console.log(data )

d3.select('.container')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .html(d => {
    const formatTimeFunction = d3.timeFormat('%Y-%m-%d');
    return '时间：'+ formatTimeFunction(d) + '<br />'+ '映射后：' + timeScale(d) + '<br />' + '<br />';
  });




const scale = d3.scaleLinear()
  .domain([1, 10])
  .range([10, 100]);

d3.select('#linear-scale')
  .selectAll('div')
  .data(data) // data已经被定义
  .enter()
  .append('div')
  .classed('one-section', true)
  .text(d =>{
    return scale(d)
  });

