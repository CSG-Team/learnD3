// 待渲染数据
const data = [
  { value: 10, category: 'dog', color: '#1890ff' },
  { value: 20, category: 'dog', color: '#1890ff' },
  { value: 30, category: 'dog', color: '#1890ff' },
  { value: 40, category: 'cat', color: '#722ed1'},
  { value: 50, category: 'cat', color: '#722ed1'},
  { value: 60, category: 'cat', color: '#722ed1'},
  { value: 70, category: 'people', color: '#fadb14' },
  { value: 80, category: 'people', color: '#fadb14' },
  { value: 90, category: 'people', color: '#fadb14' },
  { value: 99, category: 'people', color: '#fadb14' },
];

renderData(data);

function cat(category) {
  renderData(data, category)
}

/**
 * 渲染可视化数据
 */
function renderData (data, category) {

  const bars = d3.select('body')
    .selectAll('div.h-bar') // d3 可以预选择元素，这时候页面并没这些元素， 可以理解为 声明应该有这些元素
    .data(data); // data选中已经进入可视化状态的数据
  
  bars.enter()  // enter选中了未进入可视化状态
    .append('div')
    .attr('class', 'h-bar');

  d3.selectAll('.h-bar')
    .style('width', d => {
      return (d.value * 2) + 'px';
    })
    .style('background-color', d => d.color)
    .style('color', 'white')
    .style('border', '1px solid darkgray')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text(d => {
      return d.value ;
    })

  bars
    .filter((d, i) => {
      return d.category === category;
    })
    .style('background-color', 'black')
    .style('padding', '4px 12px');
    

  // bars.exit().remove();

}
