# 使用布局构造Pie Chart
## 什么是布局
布局就是图形元素在画布上的位置信息。这个位置信息和元素是独立不依赖的。通常我们都是先计算可视化元素的位置信息，而这个计算的结果是由数据决定的。
所以，布局是什么？
* 布局是一种数据：由数据驱动但不直接产生任何图形的，却表征图形位置属性的数据；
* 布局是抽象，具有复用性、灵活性；
* 布局对应不同的几何表现是不同的：比如，树图的布局、饼图的布局就明显不同，针对一种特定的图表，会有一种特定的布局描述形式（布局的数据结构）；

## 回顾之前的饼图
在这里之前，我们的饼图使用了这样的数据：
```js
  const data = [
    { startAngle: 0, endAngle: 0.1 * endAngle },
    { startAngle: 0.1 * endAngle, endAngle: 0.2 * endAngle },
    { startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle },
    { startAngle: 0.4 * endAngle, endAngle: 0.8 * endAngle },
    { startAngle: 0.8 * endAngle, endAngle: 1 * endAngle },
  ];
```
在之后的代码中,利用了d3.arc()方法生成了path对象的d属性，从而完成了从数据到图形的映射过程：

```js

 const arc = d3.arc()
    .outerRadius(200)
    .innerRadius(innerRadius);

// ....
d3.selectAll('path.arc')
  .data(data)
  .enter()
  .transition()
  .duration(1000)
  .attrTween('d', function(d){
    // d is current element data
    const start = { startAngle: 0, endAngle: 0};
    // 插值器
    const interpolate = d3.interpolate(start, d);
    // t表示时间
    return function(t){
      return arc(interpolate(t))
    }
  });
```
上面的代码片段是完成了可视化，但是问题很明显：
不错，arc()方法是生成图形的必要方法，但是它接受的参数是：
```ts
interface IArcParam = {
  startAngle: number;
  endAngle:number;
}

```
但我们实际开发中拿到需要做Pie chart的数据一定不是这种格式(IArcParam的格式)。
所以一定有这样的过程：
原始数据 --->适配成arc的参数形式。
这个过程其实我们不需要处理。对此，d3有布局方法提供给使用者。

## 饼图的布局
布局对应不同的几何表现是不同的，这是我们在最开始讲的。那么对于一张饼图来讲，他的布局，位置信息应该是什么呢？
没错，计算饼图的布局，就是在根据原始数据，计算每一段圆弧的始角度和终角度。
d3.pie(origion_data)最终返回的是被处理过的原始数据（origin data）。它将数据处理成了arc函数期望的数据格式。就是上文定义的IArcParam的格式。使用pie函数至少要指定下value，这是设置计算布局时，原始数据对应的数据字段。

下面是完整的代码：

```js

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
      // var currentArc = this.__current__;  
      // if (!currentArc)
      //     currentArc = {startAngle: 0, endAngle: 0};

      var interpolate = d3.interpolate( {startAngle: 0, endAngle: 0}, d);
      // this.__current__ = interpolate(1); // 插值器是 0 - 1 变化的

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
      console.log('arc.centroid(d) +', arc.centroid(d) )
      // 弧的中心点用法
        return "translate(" 
            + arc.centroid(d) + ")";  
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data.id;
    });
}

```
上面代码中还涉及一个知识点是 arc.centroid(d)，它是生成arc中心点位置的方法，返回值是[numbre, number]，刚好可以toString()成 x，y的形式，供translate用。 这里用于添加文本。
