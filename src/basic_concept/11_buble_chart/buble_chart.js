const width = 600;
const height = 600;
const margins = {
  top: 30,
  left: 30,
  bottom: 30,
  right: 30,
};
const colors = d3.scaleOrdinal(d3.schemeCategory10);

const draw_width = width - margins.left - margins.right;
const draw_height = height - margins.top - margins.bottom;

const x_start = margins.left;
const y_start = height - margins.bottom;
const y_end = margins.top;

let svg, chart_g;

let isFirstRendered = false;

const symbolTypes = d3.scaleOrdinal()
.range([
  "circle",
  "cross",
  "diamond",
  "square",
  "triangle-down",
  "triangle-up",
  ]);

function render(data){
  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  const xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([draw_height, 0]);
  
  // axis render
  if(!isFirstRendered){
    isFirstRendered = renderAxis(xScale, yScale);

    let padding = 5;

    svg.append("defs")
      .append("clipPath")
      .attr("id", "body-clip")
      .append("rect")
      .attr("x", 0 - padding)
      .attr("y", 0)
      .attr("width", draw_width+ 2 * padding)
      .attr("height", draw_height);
  }


    if(!chart_g){
      chart_g = svg.append('g')
        .attr('class', 'body')
        .attr("transform", "translate("
          + x_start + ","
          + y_end + ")")  
        .attr("clip-path", "url(#body-clip)");
      }

    const bubble = chart_g.selectAll(".bubble")
      .data(data)
  
    bubble.enter()
      .append('circle')
      .merge(bubble)
      .attr('class', 'bubble')
      .attr('stroke', (d, i)=>{
        return '#fa8c16'
      })
      .attr('stroke-width', 3)
      .attr('fill', 'rgba(0,0,0,0.35)')
      .transition() 
      .attr('cx', (d, i)=> xScale(d.x) )
      .attr('cy', (d, i)=> yScale(d.y) )
      .attr('r', (d, i)=> d.r * 5 );

      console.log('in exit', bubble.exit())

    bubble
      .exit()
      .attr('stroke', (d, i)=>{
        return '#096dd9'
      })
      .transition() 
      .duration(1200)
      .attr('r', function(d){
        console.log('d3.select(this)', d3.select(this))
        return d3.select(this).attr('r') * 3;
      })
      .transition() 
      .duration(600)
      .attr('r', 0)
      .remove();
  
}


function renderAxis(xScale, yScale) {
  const axis_g = svg.append('g')
    .attr('class', 'axis');

  const xAxis = d3.axisBottom()
    .scale(xScale);
  axis_g.append('g')
    .attr('class', 'x_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_start + ')' 
    })
    .call(xAxis);

  d3.selectAll("g.x_axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - draw_height)
    .attr('stroke', 'lightgray');

  const yAxis = d3.axisLeft()
    .scale(yScale);
  axis_g.append('g')
    .attr('class', 'y_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_end + ')' 
    })
    .call(yAxis);

  d3.selectAll("g.y_axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", draw_width)
    .attr("y2", 0)
    .attr('stroke', 'lightgray');

  return true;


}


const numberOfDataPoint = 10;
let datax = [];

function randomData() {
  return Math.random() * 9;
}

function genData(){
  datax = [];
  for (var i = 0; i < numberOfDataPoint; i++){
    datax.push({
      x: randomData(), 
      y: randomData(), 
      r: randomData(),
    });
  }
  
}
genData();


render(datax);

let repeatTime = 0;

function repeat(){
  // genData();
  // datax.shift()
  if(repeatTime % 3 === 0 ){
    datax.pop();
    datax.pop();

  }
  datax.push({
    x: randomData(), 
    y: randomData(), 
    r: randomData(),
  })
  render(datax)

  repeatTime++;
}

setInterval(repeat, 3000)