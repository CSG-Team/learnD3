const width = 1000;
const height = 600;
const r = 3;
const nodes = [];

const force = d3.forceSimulation()
  .velocityDecay(0) // 速度衰减 速度越下，跑的越快 设成0就很有意思
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

let prevPoint;

svg.on('mousemove', function() {
  const point = d3.mouse(this)
  const node = {
    x: point[0],
    y: point[1],
    // 设置下初始速度
    vx: prevPoint? point[0] - prevPoint[0] : point[0],
    vy: prevPoint? point[1] - prevPoint[1] : point[1],
  };

  prevPoint = point;

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
    .delay(6000) // 6000 ms后消失
    .duration(700)
    .attr('r', 60)
    .style('fill', 'transparent')
    .on('end', function(){
      nodes.shift();
      force.nodes(nodes);
    });

    // 增加节点
    nodes.push(node);
    force.nodes(nodes);

});
