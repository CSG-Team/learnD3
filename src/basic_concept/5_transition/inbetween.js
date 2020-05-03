const body = d3.select('body');
const duration = 5000;

// body.append('div')
//   .append('input')
//   .attr('type', 'button')
//   .attr('class', 'countdown')
//   .attr('value', '0')
//   .style('height', '150px')


  // body.append("div").append("button")
  //     .attr("class", "countdown")
  //     .style("width", "150px")
  //     .text('0')
  //     .transition().duration(duration).ease(d3.easeLinear)
  //     .style("width", "400px")
  //     .text('9')


  body.append("div").append("input")
  .attr("type", "button")
  .attr("class", "countdown")
  .attr("value", "0")
  .style("width", "150px")
  .transition().duration(duration).ease(d3.easeLinear)
      .style("width", "400px")
      .attr("value", "9");
      
body.append("div").append("input")
  .attr("type", "button")
  .attr("class", "countdown")
  .attr("value", "0")
  .transition().duration(duration).ease(d3.easeLinear)
      .styleTween("width", widthTween) // 并非直接指定最终值而是指定一个计算中间帧函数
      .attrTween("value", valueTween); 
      
      
function widthTween(){
  var interpolate = d3.scaleQuantize()
      .domain([0, 1])
      .range([150, 200, 250, 350, 400]);
  
  return function(t){
      return interpolate(t) + "px";
  };
}
      
function valueTween(){
  var interpolate = d3.scaleQuantize() // 量化比例尺与 linear scales 类似，但是其输出区间是离散的而不是连续的
      .domain([0, 1])
      .range([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  return function(t){ // <-D
      return interpolate(t);
  };
} 