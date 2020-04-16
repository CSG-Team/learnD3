// 待渲染数据
const data = [20, 15, 30, 50, 80, 70, 45, 22, 18];

function handle_bind_basic_data () {

  // 定时更改数据并重新渲染
  setInterval(()=>{
    changeData();
    renderData();
  }, 2000);

  // 初始渲染
  renderData();
}

/**
 * 改变待渲染数据
 */
function changeData () {
  data.shift();
  data.push(Math.round(Math.random() * 100));
}

/**
 * 渲染可视化数据
 */
function renderData () {

  const bars = d3.select('body')
    .selectAll('div.h-bar') // d3 可以预选择元素，这时候页面并没这些元素， 可以理解为 声明应该有这些元素
    .data(data); // data选中已经进入可视化状态的数据
  
  bars.enter()  // enter选中了未进入可视化状态
    .append('div')
    .attr('class', 'h-bar')
  .merge(bars)  // merge将未进入和进入可视化状态的合并以便于统一处理
    .style('width', d => {
      return (d * 2) + 'px';
    })
    .style('background-color', '#b37feb')
    .style('color', 'white')
    .style('border', '1px solid #531dab')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text(d => {
      return d;
    })

  // exit
  bars.exit()
    .remove(); // remove()函数删除那些需要退出的元素

}


function renderData_withoutMerge () {

  const bars = d3.select('body')
    .selectAll('div.h-bar') // d3 可以预选择元素，这时候页面并没这些元素， 可以理解为 声明应该有这些元素
    .data(data) // data选中已经进入可视化状态的数据
    .style('width', d => {
      return (d * 2) + 'px';
    })
    .style('background-color', '#b37feb')
    .style('color', 'white')
    .style('border', '1px solid #531dab')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text(d => {
      return d;
    })

  console.log('bars is =>', bars)
  
  bars.enter()  // enter选中了未进入可视化状态
    .append('div')
    .attr('class', 'h-bar')
  // .merge(bars)  // merge将未进入和进入可视化状态的合并以便于统一处理
    .style('width', d => {
      return (d * 2) + 'px';
    })
    .style('background-color', '#b37feb')
    .style('color', 'white')
    .style('border', '1px solid #531dab')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text(d => {
      return d;
    })

  // exit
  bars.exit()
    .remove(); // remove()函数删除那些需要退出的元素

}
