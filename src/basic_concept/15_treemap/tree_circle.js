// 基本设置
const width = 2000;
const height = 2000;
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
        return "translate(" + marginLeft
                + "," + marginTop+ ")";
    });

    // treemap_g = d3.treemap()
    //   .size([width, height])
    //   .round(true)
    //   .padding(1);
    tree_g = d3.tree()
      // .size([
      //   (height - marginTop - marginBottom), // tree 默认是纵向的 所以这里是 y, x
      //   (width - marginLeft - marginRight),
      // ]);
      .size([2 * Math.PI, 500])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
  }

  const root = d3.hierarchy(data)
    // .sum(valueAccessor)
    // .sort((a, b) => b.value - a.value);

  tree_g(root);

  console.log('root', root);
  console.log('root leaves()', root.leaves())


  // const cells = chart_g.selectAll('g')
  //   .data(root.leaves())
  // renderCells(cells);

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
    // .attr('transform', (d)=>{
    //   return `translate(${d.y}, ${d.x})`
    // })
    .attr("transform", d => {
      console.log('3333333333->',d)
      return ` rotate(${d.x * 180 / Math.PI - 90})
      translate(${d.y},0) `
    }).append('circle')
    .attr('r', 4)
    // .attr('cx', 0)
    // .attr('cy', 0)
    .attr('stroke', 'darkgray')
    .attr('fill', 'blue');
    // .on('click', (d)=>{
    //   console.log("Click")
    //   toggle(d)
    //   renderData(root)

    // });

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
      return `translate(${d.y}, ${d.x})`
    });


    nodesUpdate.select('circle')
      .style('fill', (d) => {
        return d._children ? 'lightsteelblue' : '#fff'
      })
    
    const nodeExit = nodesElement.exit()
      .transition().duration(TIME_DURATION)
      .attr('transform', (d)=>{
        return `translate(${d.y}, ${d.x})`
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
  const nodes = root.descendants().slice(1);
  console.log('nodes --', nodes.slice(1));
  const edge = chart_g.selectAll('path.edge')
    .data(nodes, (d) => {
      return d.id;
    });
  
  edge.enter().insert('path', 'g')
    .attr('class', 'edge')
    .transition()
    .duration(TIME_DURATION)
    .attr('d', (d) => {
      console.log("d in edge ->", d)
      // console('genEdgePath(d, d.parant)', genEdgePath(d, d.parant))
      return genEdgePath(d, d.parent)
    })
    .attr('stroke', '#333')
    .attr('fill', 'transparent')
    ;

  edge.exit().remove();
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
