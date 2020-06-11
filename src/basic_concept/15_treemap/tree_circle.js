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

renderData(tree_map_data,)

function renderData(data, ) {

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
        return "translate(" + width / 2
                + "," + height / 2+ ")";
    });

    tree_g = d3.tree()
      .size([2 * Math.PI, 500])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
  }

  const root = d3.hierarchy(data)

  tree_g(root);
  renderNodes(root);
  renderDataEdges(root);

}

function renderNodes(root) {
  // 层级中所有节点
  const nodes = root.descendants();
  const nodesElement = chart_g.selectAll('g.node')
    .data(nodes, (d) => {
      return d.id
    })
  
  const nodesEnter = nodesElement.enter()
    .append('g')
    .attr('class', 'node')
    .attr("transform", d => {
      console.log('3333333333->',d)
      return `rotate(${d.x * 180 / Math.PI - 90})
      translate(${d.y},0) `
    })
    .on('click', (d)=>{
      console.log("Click")
      toggle(d)
      renderData(root)

    });

  nodesEnter.append('circle')
    .attr('r', 4)
    // .attr('cx', 0)
    // .attr('cy', 0)
    .attr('stroke', 'darkgray')
    .attr('fill', 'blue');


  const nodesUpdate = nodesEnter
    .merge(nodesElement)
    .transition()
    .duration(TIME_DURATION)
    .attr('transform', (d)=>{
      return ` rotate(${d.x * 180 / Math.PI - 90})
      translate(${d.y},0) `
    });


    nodesUpdate.select('circle')
      .style('fill', (d) => {
        return d._children ? 'lightsteelblue' : '#fff'
      })
    
    const nodeExit = nodesElement.exit()
      .transition().duration(TIME_DURATION)
      .attr('transform', (d)=>{
        return ` rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0) `
      })
      .remove();
    renderLabels(nodesEnter, nodesUpdate, nodeExit);
}

function renderLabels(nodeEnter, nodeUpdate, nodeExit) {
  nodeEnter.append("text")
    .attr("x", function (d) {
        return d.children || d._children ? -10 : 10; // <-K
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start"; // <-L
    })
    .text(function (d) {
        return d.data.name;
    })
    .style("fill-opacity", 1e-6);

 nodeUpdate.select("text")
    .style("fill-opacity", 1);

 nodeExit.select("text")
    .style("fill-opacity", 1e-6)
    .remove();
}

function renderDataEdges(root){
  const links = root.links();
  window.myRoot = root;
  // console.log('nodes --', nodes.slice(1));
  const edge = chart_g.append("g")
    .attr('class', 'edge')
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("d", d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y)
    );
}

function genEdgePath(target, source) {
  console.log('source :', source)
  console.log('target :', target)

  const path = d3.path();
  path.moveTo(target.y, target.x);
  path.bezierCurveTo((target.y + source.y) / 2, target.x,
    (target.y + source.y) / 2, source.x, source.y, source.x);
  return path.toString();
}
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
