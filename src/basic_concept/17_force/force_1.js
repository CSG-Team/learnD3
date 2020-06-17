const width = 1000;
const height = 600;
const r = 3;
const nodes = [];

const force = d3.forceSimulation()
  .velocityDecay(0.8) // 速度衰减 速度越下，跑的越快 设成0就很有意思
  .alphaDecay(0) // alpha 是 0 表示模拟永不停歇 正常迭代是从1 -> 0 的过程
  .force('collision', d3.forceCollide(r + 0.5).strength(1)); // collision是碰撞力

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px dashed #333');

force.on('tick', ()=>{
  svg.selectAll('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
});

svg.on('mousemove', function() {
  const point = d3.mouse(this)
  const node = {
    x: point[0],
    y: point[1],
  };
  svg.append('circle')
    .data([node])
    .attr('class', 'node')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 1e-6)
    .style('fill', randomColor() )
    .transition()
    .attr('r', r)
    .transition()
    .delay(6000)
    .duration(700)
    .attr('r', 60)
    .style('fill', 'transparent')
    .on('end', function(){
      nodes.shift();
      force.nodes(nodes);
    });
    nodes.push(node);
    force.nodes(nodes);

});

// 无力状态
function noForce(){
  force.force('charge', null);
  force.force('x', null);
  force.force('y', null);
  force.restart();
}

// 排斥状态
function diss() {
  force.force('charge', d3.forceManyBody().strength(-10)); // forceManyBody是节点相互作用力 大于0 吸引力
  force.force('x', null);     // 在某店处增加引力
  force.force('y', null);
  force.restart();
}

// 吸引力
function like() {
  force.force('charge', d3.forceManyBody().strength(1));
  force.force('x', null);
  force.force('y', null);
  force.restart();
}

// 吸引力 , 设置固定引力
function likeToPosition() {
  force.force('charge', d3.forceManyBody().strength(1));
  force.force('x', d3.forceX(width / 2));
  force.force('y', d3.forceY(height / 2));
  // force.force('y', null);  // 如果这样就是某个轴方向的吸引力

  force.restart();
}

// 平衡：定点引力相互斥力
function balance() {
  force.force('charge', d3.forceManyBody().strength(-20));
  force.force('x', d3.forceX(width / 2));
  force.force('y', d3.forceY(height / 2));
  force.restart();
}

