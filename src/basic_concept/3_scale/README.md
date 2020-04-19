# 尺度
As we know，数据可视化的核心工作就是做映射：将数据映射成图形。比如小明考试得了100分，小芳得了50分，那么我两个矩形表示他们的成绩，一条的长是10，一条的长是5。
映射成某个图形，其实最终落地的还是设置图形的一个或多个属性值，这个属性可能数值、颜色值或者字符等等。
那么所谓的映射，就可以划分为两部分：1、从数据到图形；2、从数据到图形属性；
这其中的第二部分，就牵扯到了这一讲的主题：尺度。

# 何为尺度？
从数学的角度讲，尺度其实是一个函数。而函数的数学定义是，两个集合的映射，具体：

> 假设A、B两个非空集合。函数f是A到B的映射，使得集合A中的任意一个元素在B中都有唯一的元素与其对应。当元素b是集合A中的的元素a通过函数f映射到集合B中的唯一元素时，记住f(a) = b;

d3中的尺度完全相符合与上述数学定义。通常都是一定规则下，从定义域到值域的单设函数。具体在编程中是这么使用：
```js
// 伪代码
尺度函数 = d3.某类尺度.定义域.值域

映射值 = 尺度函数调用( dataItem );
```

# D3中常用尺度
## 连续尺度
连续尺度是将连续的定义域映射到值域的尺度函数。常见的有线性尺度、指数尺度、对数尺度等。概念很简单就是根据函数规则已知输入求解输出， 最简单Demo：
```js
const scale = d3.scaleLinear()
  .domain([1, 10])
  .range([10, 100]);

d3.select('#linear-scale')
  .selectAll('div')
  .data(data) // data已经被定义
  .enter()
  .append('div')
  .classed('one-section', true)
  .text(d =>{
    return scale(d)
  });

```
上述代码scale就是一个从定义域1，10映射到值域1，100的函数，当然在调用scale(d)的时候，会最终输出映射后的值。

```js
const powScaleSimple = d3.scalePow()
  .exponent(3); // 指数

const powScaleSimple = d3.scaleLog() // 对数

```
上述代码是最简单的指数尺度和对数尺度函数。

## 时间尺度
时间尺度的输入是时间对象（Date对象），是一种把时间映射成数值的函数。demo代码：

```js
const start = new Date(2020, 0, 1);
const end = new Date(2020, 11, 31);
const timeScale = d3.scaleTime()
  .domain([start, end]) // 时间尺度的定义域
  .rangeRound([0, 1200]); // rangeRound与range的不同是：映射后取整
const max = 12;
const data = [];

// 构造date
for (let i = 0; i < max; i++ ) {
  let date = new Date(start.getTime());
  date.setMonth(start.getMonth() + i);
  data.push(date);
}

d3.select('.container')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .html(d => {
    const formatTimeFunction = d3.timeFormat('%Y-%m-%d');
    return '时间：'+ formatTimeFunction(d) + '<br />'+ '映射后：' + timeScale(d) + '<br />' + '<br />';
  });

```
时间尺度的定义域中是时间对象。在值域中使用rangeRound设置值域，是因为rangeRound与range的不同是映射后可以取整。
另外，d3.timeFormat('%Y-%m-%d')是d3对时间格式化的处理方法，具体参见API，d3提供了很多常用的格式化模式。

## 有序尺度(离散)
有序尺度针对定义域是非时间值的离散量。比如，'a' —> 'good', b -> 'red', c -> 555。当然，实际的需要的映射可能并不是这么没有规则。
概念简单，直接代码说话吧：
```js
const max = 10;
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 字符映射
const wordScale = d3.scaleOrdinal()
  .domain(data)
  .range(['H', 'e', 'l', 'l', 'o', 'w', 'D','3','j','s',]);

const colorScale20b = d3.scaleOrdinal(
  d3.schemeCategory20b
);

// 颜色的映射
const myColors = [
  '#8c8c8c', '#722ed1', '#2f54eb',
  '#1890ff', '#13c2c2', '#52c41a',
  '#faad14', '#fadb14', '#d4380d',
  '#ff85c0', 

];
const colorScaleMine = d3.scaleOrdinal()
  .domain(data)
  .range(myColors);

function render(data, selector, scale) {
  d3.select(selector)
    .selectAll('div.section')
    .data(data)
    .enter()
    .append('div')
    .classed('section', true)
    .style('background', d=>{
      return scale(d).indexOf('#') > -1 ? scale(d) : 'white'
    })
    .text(d=>{
      return scale(d);
    })
}

```
上面的demo代码中，展示两种离散的映射方式，一种是映射成字符，一种是映射成颜色色值。
d3.schemeCategory20b是d3的内置配色方案之一，d3还有其他的内置配色方案。

