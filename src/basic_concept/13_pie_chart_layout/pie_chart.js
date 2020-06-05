const width = 500;
const height = 500;
const fullAngel = 2 * Math.PI;
const colors = d3.scaleOrdinal(d3.schemeCategory10);
const outerRadius = 200;
const innerRadius = 100;
let svg, gBody, gPie;
const  numberOfDataPoint = 6;

function randomData() {
  return Math.random() * 9 + 1;
}

const data = d3.range(numberOfDataPoint).map(function (i) {
  return {id: i, value: randomData()};
});

render();


function render(){
  if(!svg){
    svg = d3.select('body')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
  }

  renderBody();
}

function renderBody(){
  if(!gBody){
    gBody = svg.append('g')
      .attr('class', 'body')
  }

  renderPie();
}

function renderPie(){
  const pie = d3.pie()
    .sort(d => d.id)
    .value(d => d.value);

  const arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  if(!gPie){
    gPie = gBody.append('g')
      .attr('class', 'pie')
      .attr('transform', `translate(${outerRadius}, ${outerRadius})`);
  }
  renderArc(pie, arc);

  renderLabel(pie, arc);
  
}

function renderArc( pie, arc){
  const part = gPie.selectAll('path.arc')
    .data(pie(data));
  console.log('data is', data)
  
  let current = {
    startAngle:0, endAngle:0
  }

  part.enter()
    .append('path')
    .merge(part)
    .attr('class', arc)
    .attr('fill', (d, i) => colors(i))
    .transition()
    .duration(1000)
    .attrTween('d', function(d){
      var currentArc = this.__current__;  

      if (!currentArc)
          currentArc = {startAngle: 0, endAngle: 0};

      var interpolate = d3.interpolate(
                          currentArc, d);
      console.log('arc.centroid(d) +', arc.centroid(d) )
                          
      this.__current__ = interpolate(1);

      return function (t){
        return arc(interpolate(t))
      }
    })
}

function renderLabel(pie, arc) {
  var labels = gPie.selectAll("text.label")
          .data(pie(data));  

  labels.enter()
    .append("text")
    .attr("class", "label")
    .style('fill', 'white')
    .transition()
    .duration(1000)
    .attr("transform", function (d) {
      console.log('arc.centroid(d) +', arc.centroid(d).toString() )
        return "translate(" 
            + arc.centroid(d) + ")";  
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data.id;
    });
}