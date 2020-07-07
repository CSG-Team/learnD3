16_Force
在D3.js中，模拟力是非常好玩的。通过设置各种各样和力相关的参数，可以完成很多酷炫和有趣的效果。
在可视化图表方面，力导向图通常被应用在关系图中，作为布局方法使用。
D3模拟力本质上D3提供模拟力的布局方法，我们前面的文章中说过，所谓布局方法，是提供位置信息，和具体元素的渲染无关。
这篇文章从这几个方面介绍d3的力：
* 基础力：引力和斥力、定点力、碰撞力、摩擦力
* 边的约束：链接力
* 应用1:力作用下的气泡图
* 应用2:聚类
* 应用3:力导向图

## 基础力
1. 引力和斥力：其力学模型可以类比电荷力，可以给元素间线性设定相互是受到引力还是斥力。通过设定一个有符号的值表示这个力的大小，正值表示引力，负值表示斥力。
2. 定点力：定点力是指，这个力存在于画布平面上，不是元素之间相互作用，而是所有这个空间中的元素同时受到的某一区域的力，从物理上看，定点力模拟的是场力，当然，所谓定点不一定是点这么小的单位，也可以是线，或者区域。
3. 碰撞力：碰撞力用来模拟元素在运动过程中发誓接触后所受力的大小。
4. 摩擦力：模拟元素在运动中速度的衰减快慢。
下面我们通过代码，看下如何初始化一个力模拟器，以及如何设置这些不同种类的力：
```js
const force = d3.forceSimulation()
  .velocityDecay(0.8) // 速度衰减 速度越下，跑的越快 设成0就很有意思
  .alphaDecay(0) // alpha 是 0 表示模拟永不停歇 正常迭代是从1 -> 0 的过程
  .force('collision', d3.forceCollide(r + 0.5).strength(1)); // collision是碰撞力
```
简单的四行代码，需要逐行分析：
第一行d3.forceSimulation()的返回值就是一个力学模拟器了，我们把它命名为force，后面的一些列操作其实是在设置力学模拟器的各项参数。当然，这里的参数设置当然也符合d3链式调用的传统，基于每一次都返回force对象的建造模式。
第二行velocityDecay是设置运动过程中速度衰减，摩擦力的模拟就是基于这个属性的设置，设置为0就是不衰减。
先看第四行，我们对这个force构筑的世界设定了他的规则：colision，碰撞力，就是运动中元素发生碰撞时所受了的大小，当然，这个力会改变其运动状态。d3.forceCollid设置了碰撞检测的半径，这里r是预先定义过的，strength设置具体力的值的大小。
回过头来看第三行，alphaDacay这个参数设置函数是什么意思呢？这里需要理解下alpha的概念，但是在alpha之前，先简单啰嗦两句d3的force是怎么进行力学计算的：
其原理是，D3对每一个视觉元素叠加各种力，由于各种力的存在，会导致元素产生运动，而又因为元素运动了，导致某些力（和位置相关的力）发生了变化，需要重新计算合力，那么这就是一个一次次迭代的过程。迭代终止的条件是什么？
那么，迭代终止的条件就是在d3内部，每一次计算合力时都会修改一个从1向0变化的值，总体来讲，系统越趋近力平衡状态，我们希望alpha越接近0，换句话说，每次alpha衰减的越少，迭代的次数越多，越接近真相（默认当alpha < 0.001时，迭代终止）。
所以，alphaDecay，就是每次迭代时alpha值的衰减值，这个值如果为0，则表示一致在进行模拟，never stop～
另外有一个函数tick()，我们马上会看到，这其实是模拟的过程中每一次的回调函数，通常在这个函数中做的事情就是重绘视觉元素。
这些基本概念学习完成后，看一个完整点的demo：
```js
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
```
这是一个完整的例子，例子中展示几种状态：元素无相互作用力，相互作用力为斥力，相互作用力为引力，一个定点场力，以及定点场力和相互作用力斥力最终达到平衡的状态。
首先我们看构造元素部分：
构造的过程在svg.on('mousemove', function() {}),每当该鼠标事件发生，我们就在当前位置构造一个元素（circle），并更新力学模拟器的点，相当重新告诉力学模拟器，现在有这么多点需要模拟力。这里还涉及一个过程，就是6000ms之后，点会消失，这时当然也需要更新数据，通知模拟器。
```js
    // 增加节点
    nodes.push(node);
    // 通知模拟器
    force.nodes(nodes);
```

再看下是如何改变力学模型的。力学模型的起始参数如同上文中举例所设置的样子，现在我希望改变模型，变成一个场力平衡节点间斥力的情况，该怎么做呢？
```js
  // 设置节点间斥力
  force.force('charge', d3.forceManyBody().strength(-20));
  // x 方向的场
  force.force('x', d3.forceX(width / 2));
  // y 方向的力场
  force.force('y', d3.forceY(height / 2));
  // 力学模型重新运行
  force.restart();

```
force.force('charge', d3.forceManyBody().strength(-20)); 这行代码为节点间设置了斥力；而force.force('x', d3.forceX(width / 2));在x = width/2的地方设置了一个定点场力，就像地心引力一样。最后force.restart()重新启用这个力学模型，以便新的设置生效。

还有一个关键问题，如何更新状态？
到现在为止，我们生成了节点，也改变了力学模型，但是一个很重要的点还没有涉及：在力学模型的一次次迭代计算中，元素的运动状态应该被改变了，但是怎么改变呢？

```js
force.on('tick', ()=>{
  svg.selectAll('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
});
```
这里就涉及力学模型的tick事件及其回调函数了，之前我们讲了，力学模型在一次次迭代计算合力，但其实在计算之后，它会重新设置元素的位置属性，比如x，y，vx，vy等，同时会执行tick事件的回调函数，那么我们要做的就是在这个回调函数中，更新视觉元素的位置信息。

关于定点场力，假设只设置一个方向的力会发生什么？
```js
// 只设置这个
force.force('x', d3.forceX(width / 2));

```
其实就是设置了一个轴向的场力，[这里](https://github.com/xswei/d3-force/blob/master/README.md#forceX)可以了解更多。




