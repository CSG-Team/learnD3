const width = 600, height = 350, r = 50;

const data = [
  [width / 2 - r, height / 2 - r],
  [width / 2 - r, height / 2 + r],
  [width / 2 + r, height / 2 - r],
  [width / 2 + r, height / 2 + r]
];

const svg = d3.select("body").append("svg")
  .attr("style", "1px solid black")
  .attr('width', 600)
  .attr('height', 600)
  .style('border', '1px solid darkgray')
  .call(  
    d3.zoom()  
      .scaleExtent([0.1, 10]) 
      .on("zoom", zoomHandler)  
  )
  .append("g");

svg.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("r", r)
  .attr("transform", function (d) {
    return "translate(" + d + ")";
  });

function zoomHandler() {
  const transform = d3.event.transform;
  const { x, y, k } = transform;

  svg.attr("transform",`translate(${x}, ${y})scale(${k})`);
}