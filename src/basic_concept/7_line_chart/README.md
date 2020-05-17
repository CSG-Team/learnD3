# 折线图
折线图可能是最入门的可视化图表了，一般用来反应数据变化的趋势。
>折线图是排列在工作表的列或行中的数据可以绘制到折线图中。折线图可以显示随时间（根据常用比例设置）而变化的连续数据，因此非常适用于显示在相等时间间隔下数据的趋势。

## 使用d3绘制折线图
我们考虑使用d3绘制折线图。其核心应该就是让d3帮忙生成一条能反应数据的曲线，这个方法d3还真的有：
那就是:
* d3.line()
d3.line()这个方法生成的其实并不是svg的line对象，而是path的对象的d属性，所以最终都是要被设置到path元素上的。
line()和数据相关的设置就是.x().y(), 分别在x方法和y方法中传入一个函数，这个函数的入参就是数据，而出参就是你所希望的line在x轴或y轴的值。
line().curve()方法是可选的，用来设置line()曲线将被如何插值，是曲线或者直线。
具体用法入下代码所示：
```
const line = d3.line() // <-D
  .x(function(d){return x(d.x);})
  .y(function(d){return y(d.y);})
  // curve可以设置多种线条插补样式
  // .tension属性更是可以接受一个0-1的值用来确定进一步的弯曲程度
  .curve(d3.curveBasis);
```
下面一段代码是一个最简易的完整的绘制折线图的demo。

```
const width = 500;
const height = 500;
const margin = 50;

const x = d3.scaleLinear()
  .domain([0, 10])
  .range([margin, width - margin]);

const y = d3.scaleLinear()
  .domain([0, 10])
  .range([height - margin, margin]);

const data = [
  [  
    { x: 0, y: 5 }, 
    { x: 1, y: 9 }, 
    { x: 2, y: 6 }, 
    { x: 3, y: 3 }, 
    { x: 4, y: 2 }, 
    { x: 5, y: 8 }, 
    { x: 6, y: 7 }, 
    { x: 7, y: 4 }, 
    { x: 8, y: 1 }, 
    { x: 9, y: 3 }, 
  ]
];

// 这里的line是一个生成函数
// 其输入是一个数组
// 输出是是一串可以被设置为 path中d属性值的字符串
const line = d3.line() // <-D
  .x(function(d){return x(d.x);})
  .y(function(d){return y(d.y);})
  // curve可以设置多种线条插补样式
  // .tension属性更是可以接受一个0-1的值用来确定进一步的弯曲程度
  .curve(d3.curveBasis);

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg.selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('class', 'line')
  .attr('d', d=>{
    return line(d)
  });

// render axis 
const axis = d3.axisBottom()
  .scale(x)
  .ticks(10);  // 刻度个数

// axis 放入组svg : g 中
svg.append('g')
  // 设置绘制时便宜位置
  .attr('transform',`translate(${0}, ${height - margin})`)
  .call(axis); // call 方法 调用作为参数传入的函数，并以当前选集作为参数

```
代码很简单，但是有一些点还是需要注意下：
* 你的数据绘制映射的scale（比例尺度）应该和axis轴线的比例尺度统一，可以看到例子中axis的比例设置的是scale(x)，x是scale函数，而 line.x(function(d){return x(d.x);})最终return的值也是用x做了映射；

* 再次强调下，line()生成的是path的d属性的值；
```
svg.selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('class', 'line')
  .attr('d', d=>{
    return line(d)
  });
```
* line()接受的参数的数据结构是一维数组，所以我们声明数据的时候是：
```
const data = [
  [  
    { x: 0, y: 5 }, 
    { x: 1, y: 9 }, 
    { x: 2, y: 6 }, 
    { x: 3, y: 3 }, 
    { x: 4, y: 2 }, 
    { x: 5, y: 8 }, 
    { x: 6, y: 7 }, 
    { x: 7, y: 4 }, 
    { x: 8, y: 1 }, 
    { x: 9, y: 3 }, 
  ]
];

```
因为最终设置属性的时候，d3是用data的每一个子元素作为参数d的值：
```
selection
.data(data)
.enter()
.attr('d', d => {  // d是data的子元素，而line需要的是数组
  return line(d)
});
```

## 问题
做一个更通用的图表line。
基于上面简单的demo和用法，我们其实可以做得更好，因为这个图表不够通用。