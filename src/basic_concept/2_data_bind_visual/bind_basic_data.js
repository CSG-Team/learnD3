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
    .selectAll('div.h-bar')
    .data(data);
  
  bars.enter()
    .append('div')
    .attr('class', 'h-bar')
  .merge(bars)
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
    .remove();

}
