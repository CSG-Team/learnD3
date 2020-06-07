// 基本设置
const width = 1600;
const height = 800;

const colors = d3.scaleOrdinal(d3.schemeCategory10);

let svg, chart_g, treemap_g;

window.myColor = colors;

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
      .attr('class', 'body');

    treemap_g = d3.treemap()
      .size([width, height])
      .round(true)
      .padding(1);

  }

  const root = d3.hierarchy(data)
    .sum(valueAccessor)
    .sort((a, b) => b.value - a.value);

  treemap_g(root);

  console.log('root', root);
  console.log('root leaves()', root.leaves())


  const cells = chart_g.selectAll('g')
    .data(root.leaves())

  renderCells(cells);


}

function renderCells(cells) {
  const cellEnter = cells.enter()
    .append('g')
    .merge(cells)
    .attr('class', 'cell')
    .attr('transform', d=>{
      return `translate(${d.x0}, ${d.y0})`
    });

  renderRect(cellEnter, cells);
  renderText(cellEnter, cells);
  cells.exit().remove();

}

function renderRect(cellEnter, cells) {
  cellEnter.append("rect");

  cellEnter.merge(cells)
    .transition()
    .select("rect")
    .attr("width", function (d) { 
        return d.x1 - d.x0;
    })
    .attr("height", function (d) {
        return d.y1 - d.y0;
    })
    .style("fill", function (d) {
        return colors(d.parent.data.name); 
    });
}

function renderText(cellEnter, cells) {
  cellEnter.append("text");

  cellEnter.merge(cells)
    .select("text") //<-H
    .style("font-size", 11)
    .attr("x", function (d) {
        return (d.x1 - d.x0) / 2;
    })
    .attr("y", function (d) {
        return (d.y1 - d.y0) / 2;
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data.name;
    })
    .style("opacity", function (d) {
        d.w = this.getComputedTextLength();
        return d.w < (d.x1 - d.x0) ? 1 : 0; //<-I
    });
}

