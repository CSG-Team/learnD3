// 待渲染数据
const data = [
  { width:10, color: 12},
  { width:30, color: 33},
  { width:60, color: 77},
  { width:80, color: 99},
  { width:45, color: 40},
  { width:24, color: 50},
  { width:77, color: 50},
  { width:44, color: 90},
  { width:19, color: 20},
  { width:25, color: 17},
];

// 定义了一个颜色插补器
// 返回一个函数 通过 domain 的值 来映射 range中的值的
const colorScale = d3.scaleLinear()
  .domain([0, 100])
  .range(['#722ed1', '#ffadd2']);


function handle_bind_obj_data () {

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
  const newItem = {
    width: Math.round(Math.random() * 100),
    color: Math.round(Math.random() * 100),

  }
  data.push(newItem);
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
      const { width } = d;
      return (width * 4) + 'px';
    })
    .style('background-color', d =>{
      const { color } = d;
      return colorScale(color);
    })
    .style('color', 'white')
    .style('border', '1px solid #531dab')
    .style('border-radius', '4px')
    .style('margin', '10px')
    .style('padding', '0px 12px')
    .text(d => {
      return d.width;
    })

  // exit
  bars.exit()
    .remove(); // remove()函数删除那些需要退出的元素

}
