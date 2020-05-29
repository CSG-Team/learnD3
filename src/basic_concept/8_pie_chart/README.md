# 饼图
使用d3绘制饼图其实和绘制折线图的思路差不多：
将数据通过d3提供的函数，生成一个path元素的d属性。


那生成弧形的方法就是d3.arc() 函数。
通过一段代码理解下。
```js
const width = 500;
const height = 500;
const fullAngel = 2 * Math.PI;
const colors = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3.select('body')
  .append('svg')
  .attr('class', 'pie')
  .attr('height', height)
  .attr('width', width)

function render(innerRadius, endAngle){
  if(!endAngle) endAngle = fullAngel;
  const data = [
    { startAngle: 0, endAngle: 0.1 * endAngle },
    { startAngle: 0.1 * endAngle, endAngle: 0.2 * endAngle },
    { startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle },
    { startAngle: 0.4 * endAngle, endAngle: 0.8 * endAngle },
    { startAngle: 0.8 * endAngle, endAngle: 1 * endAngle },
  ];

  const arc = d3.arc()
    .outerRadius(200)
    .innerRadius(innerRadius);

  svg.select('g').remove();
  svg.append('g')
    .attr('transform', 'translate(200, 200)')
    .selectAll('path.arc')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('fill', function(d, i){
      return colors(i);
    })
    .attr('d', function(d, i){
      return arc(d)
    });
}

render(100)

```

在上面的代码中，这句话：
```js
const arc = d3.arc()
  .outerRadius(200)
  .innerRadius(innerRadius);
```
设置了弧形的内圆尺寸和外圆半径，arc最终得到是一个函数，这个函数接受的参数是：
```
type = { 
  startAngle: number;
  endAngle: number;
}

```
所以最终在enter之后设置d属性的时候是这样（回调函数中的d就是数据data的每一个item）：
```js
.attr('d', function(d, i){
  return arc(d)
})
```

另外，如果每次变化数据的时候都想加点动画该怎样做？
data进入enter后，我们变为下面的代码：
```js
// 在enter()后 
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
})

```
由transition()设置一个动画，并且生成它的tween属性。但是tween属性的值，其实是由以时间为参数的插值器决定的。

最后，这篇文章只是最基本的d3中绘制piechart的方法，实际要应用，还要有很多进一步的处理过程的。

