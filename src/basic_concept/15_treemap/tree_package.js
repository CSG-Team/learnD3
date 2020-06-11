// 基本设置
const width = 1000;
const height = 1000;
const marginTop = 30;
const marginBottom = 30;
const marginLeft = 50;
const marginRight = 30;
const TIME_DURATION = 500;

const colors = d3.scaleOrdinal(d3.schemeCategory10);

let svg, chart_g, tree_g;

renderData(tree_map_data, d=>d.size)

function renderData(data, valueAccessor) {

  if(!svg) {
    svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }


  if(!chart_g){
    chart_g = svg.append('g')
      .attr('class', 'body')
      .attr("transform", function (d) {
        return "translate(" + marginLeft
                + "," + marginTop+ ")";
    });

    tree_g = d3.pack()
      .size([width, height]);
  }

  const root = d3.hierarchy(data)
    .sum(valueAccessor)
    .sort((a, b) => {
      return b.value - a.value;
    })

  tree_g(root);

  renderNodes(root.descendants());

  // renderDataEdges(root);


}

function renderNodes(root) {

  const circles = chart_g.selectAll('circle')
    .data(root);
  
    circles.enter()
      .append('circle')
      .merge(circles)
      .transition()
      .attr('class', d=> d.children ? 'parent': 'child')
      .attr('cx', d=> d.x)
      .attr('cy', d=> d.y)
      .attr('r', d=> d.r);

    circles.exit()
      .attr('r', 0)
      .remove();


    renderLabels(root);
}
function renderLabels(nodes) {
  const labels = chart_g.selectAll("text")
    .data(nodes);

  labels.enter().append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .merge(labels).transition()
    .attr("class", function (d) {
        return d.children ? "parent" : "child";
    })
    .attr("x", function (d) {return d.x;}) // <-E
    .attr("y", function (d) {return d.y;})
    .text(function (d) {return d.data.name;});

  labels.exit().remove();
}