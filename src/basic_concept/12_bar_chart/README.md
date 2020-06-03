# Bar Chart

条形图（📊bar chart）是也可以叫直方图。通常是用矩形表示一组相关的数据。它其实侧重表现不同对象在同一维度的对比信息，而并不适合表现某一对象的趋势信息。通常趋势信息用折线图会更好。

使用d3做可视化图表的几个思路：
1. 借助图形生成器，生成可用于path对象的d属性，比如折线图、面积图、简易的饼图；
2. 将数据映射成基础图形的属性，比如形状、位置等，散点图、直方图等；

和做气泡图的思路类似，直方图的思路也是在合适的位置生成和具有某些能被数据映射的属性的图形。比如，气泡图，我们将三个维度的信息映射成了x轴位置,y轴位置,r气泡半径大小；那么直方图我们将信息映射成x轴位置，条Bar的高度。

有了上边的思路，其实核心代码基于气泡图修改下，还是应用d3的经典update - enter - exit模式：
```js

const bars = chart_g.selectAll(".bar")
  .data(data)

bars.enter()
  .append('rect')
  .merge(bars)
  .attr('class', 'bar')
  .attr('stroke', (d, i)=>{
    return '#fa8c16'
  })
  .attr('stroke-width', 3)
  .attr('fill', 'rgba(0,0,0,0.35)')
  .transition() 
  .attr('x', (d, i)=> ( i * (everyWidth + paddingBetween) ))
  .attr('y', (d, i)=> yScale(d.y) )
  .attr('width', (d, i)=> everyWidth)
  .attr('height', (d, i)=>  y_start - yScale(d.y))

bars
  .exit()
  .attr('fill', (d, i)=>{
    return 'blank'
  })
  .transition() 
  .duration(500)
  .attr('height', 0)
  .remove();

```
主要看下enter部分，真正依赖数据项的属性其实只有height, x在这个简单demo里面也算相关，不过这里确实没有太多实际意义，而width是根据数据的个数计算得到的，不算依赖数据项本身。
