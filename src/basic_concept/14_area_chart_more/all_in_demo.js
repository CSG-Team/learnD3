// 基本设置
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


renderCommon();

function renderCommon() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOrderNone  );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}

function renderStack() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOffsetNone );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([0, 28])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}


function renderStackPercent() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .offset(d3.stackOffsetExpand );

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    // .domain([0, 20])
    .domain([0, 1])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  });
}

function renderRiver() {
  const stackLayoutDataFunction = d3.stack()
  .keys(['value1', 'value2', 'value3'])
  .order(d3.stackOrderInsideOut)
  .offset(d3.stackOffsetWiggle)

  const stackData  = stackLayoutDataFunction(odata);
  
  const xScale = d3.scaleLinear()
    .domain([0, 26])
    .range([0, draw_width]);
  const yScale = d3.scaleLinear()
    .domain([-30, 50])
    .range([draw_height, 0]);
  renderData(stackData, {
    xScale, yScale
  }, false);
}


function renderData(data, scaleSetting, renderYAxes = true) {
  const {
    xScale, yScale
  } = scaleSetting;
  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  renderAxis(xScale, yScale, renderYAxes);
  renderClipPath(svg);

  if(!chart_g){
    chart_g = svg.append('g')
      .attr('class', 'body')
      .attr("transform", "translate("
        + x_start + ","
        + y_end + ")")  
      .attr("clip-path", "url(#body-clip)");
  }
  chart_g.selectAll('path.line')
    .merge(chart_g.selectAll('path.area'))
    .remove();

  renderArea(data, scaleSetting);
  renderLines(data, scaleSetting);

}


function renderLines (data, scaleSetting) {
  console.log('renderLines ... s')
  const {
    xScale, yScale,
  } = scaleSetting;
  const lineFunc = d3.line()
    .x(function(d, i){ return xScale(i)})
    .y(function(d){ return yScale(d[1])});

  const pathLines = chart_g.selectAll('path.line')
    .data(data);
  pathLines
    .enter()
    .append('path')
    .merge(pathLines)
    .attr('class', 'line')
    .style('stroke', function(d, i){
      return colors(i);
    })
    .style('line-width', 2)
    .transition()
    .attr('d', function(d){
      console.log('draw line ', d)
      return lineFunc(d);
    });
}


function renderArea (data, scaleSetting) {
  const {
    xScale, yScale,
  } = scaleSetting;
  const areaFunc = d3.area()
    .x(function(d, i){ return xScale(i)})
    .y0(function(d){ return yScale(d[0])})
    .y1(function(d){ return yScale(d[1])});

  const pathAreas = chart_g.selectAll('path.area')
    .data(data);
  pathAreas
    .enter()
    .append('path')
    .merge(pathAreas)
    .style('stroke', function(d, i){
      return colors(i);
    })
    .style('fill', function(d, i){
      return colors(i);
    })
    .style('opacity', 0.3)
    .attr('class', 'area')
    .transition()
    .attr('d', function(d){
      return areaFunc(d);
    });
}

function renderClipPath(svg){
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

function renderAxis(xScale, yScale, renderYAxes) {
  d3.selectAll('.x_axis').remove();
  d3.selectAll('.y_axis').remove();
  d3.selectAll('g.x_axis g.tick').selectAll('.grid-line').remove();
  d3.selectAll('.grid-line').remove();


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

  // d3.selectAll("g.x_axis g.tick")
  //   .append("line")
  //   .classed("grid-line", true)
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", 0)
  //   .attr("y2", - draw_height)
  //   .attr('stroke', 'lightgray');

  const yAxis = d3.axisLeft()
    .scale(yScale);

  if(renderYAxes){
    axis_g.append('g')
    .attr('class', 'y_axis')
    .attr('transform', function(){
      return 'translate(' + x_start + ',' + y_end + ')' 
    })
    .call(yAxis);

    // d3.selectAll("g.y_axis g.tick")
    //   .append("line")
    //   .classed("grid-line", true)
    //   .attr("x1", 0)
    //   .attr("y1", 0)
    //   .attr("x2", draw_width)
    //   .attr("y2", 0)
    //   .attr('stroke', 'lightgray');
  }
  return true;

}




