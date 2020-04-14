// 并不算常用的技术
// 待渲染函数
const data = [];
// 数据项的计算函数
const datum = x => {
  return x * x * 10;
};

const newData = () => {
  data.push(datum);
  return data;
};

function handle_bind_function_data () {

  // 定时更改数据并重新渲染
  setInterval(()=>{
    renderData();
  }, 1500);

  // 初始渲染
  renderData();
}

/**
 * 渲染可视化数据
 */
function renderData () {

  const divs = d3.select('#container')
    .selectAll('div') // d3 可以预选择元素，这时候页面并没这些元素， 可以理解为 声明应该有这些元素
    .data(newData); // data选中已经进入可视化状态的数据
  
  divs.enter()  // enter选中了未进入可视化状态
    .append('div')
    .style('width', (d, i) => {
      return d(i) + 'px';
    })
    .style('background-color', '#b37feb')
    .style('color', 'white')
    .style('border', '1px solid #531dab')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text((d, i) => {
      return d(i);
    })

  // exit
  divs.exit()
    .remove(); // remove()函数删除那些需要退出的元素

}
