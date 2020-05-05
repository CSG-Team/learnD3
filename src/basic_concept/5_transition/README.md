# 动画
动画其实很重要。可视化项目中适当的使用动画，除了能带来酷炫的效果之外，还能增加故事性和说明性。
d3提供了全套的动画支持。
[Trasiition API](https://github.com/xswei/d3-transition/blob/master/README.md#selection_transition)

## 基本用法
### 单元素动画
```js
const body = d3.select('body');
const duration = 5000; // 持续时间

body.append('div')
  .classed('myDiv', true)
  .style('background-color', 'red')
  .transition()
  .duration(duration)
  .style('background-color', 'blue')
  .style('margin-left', '600px')
  .style('width', '100px')
  .style('height', '100px');
```
这个Demo为单个元素设置了动画，主要的API其实很简单 selection.transition().duration(duration), transition()宣布开启动画，duration()设置了这个动画应该经历的时间。
但是动画transition设置了什么呢？
其实就是设置了从transition调用前的style过度到调用后的style。
比如说
对于background-color这个样式：动画就是从red过度到blue。
如果一个transition的某些过度属性前后设置值缺失，d3会设置一些默认值作为补充。

### 多元素动画
其实用法一样，就是将transition作用到多元素的选集上。
只不过下面的这个例子，稍微综合下：
```js

let id = 0;

const data = [];
const duration = 500;
const chartHeight = 100;
const chartWidth = 800;

function render(){
  const selection = d3.select('body')
    .selectAll('div.v-bar')
    .data(data, d => d.id);

  // enter
  selection.enter()
    .append('div')
    .attr('class', 'v-bar')
    .style('z-index', 0)
    .style('position', 'fixed')
    .style('left', (d, i) => {
      return barLeft( i + 1 ) + 'px'
    })
    .style('height', '0px')
    .append('span');

  // update
  selection
    .transition().duration(duration)
    .style('top', d => {
      return chartHeight - barHeight(d) + 'px';
    })
    .style('left', (d, i) => {
      return barLeft(i) + 'px';
    })
    .style('height', d => {
      return barHeight(d) + 'px';
    })
    .select('span')
    .text(d => d.value);

  // exit 
  selection.exit()
    .transition().duration(duration)
    .style('left', (d, i) => {
      return barLeft(-1);
    })
    .remove();

}

function pushData() {
  data.push({
    id: ++ id,
    value:  20 + Math.round(Math.random() * (chartHeight  - 20 )) ,
  });
}

function barLeft(i) {
  return i * ( 30 + 2 );
}

function barHeight (d) {
  return d.value;
}

setInterval(() => {
  data.shift();
  pushData();
  render();

}, 2000)

for (let i = 0; i < 20 ; i ++ ) {
  pushData();
} 
render();
d3.select('bady')
  .attr('class', 'baseline')
  .style('position', 'fixed')
  .style('z-index', 1)
  .style('top', chartHeight + 'px')
  .style('left', '0px')
  .style('width', chartWidth);
```
上面的例子中，结合enter-update-exit模式，对一组变化的数据绘制条形图。
render()方法中，当数据update进入的时候设置transition，让已经存在的条形图向左移动；但是最左边的条其实这个数据已经被shift()移除了，所以针对exit的动画也有处理这样的情况。
我们每次数据变化的时候都在调用render()，render方法中借助enter-update-exit模式为可视化进行了统一的处理。

## 缓动动画 EASE
ease，缓动函数。说白了就是设置这个动画怎么动，动画其实就是某个属性的value改变，随着时间value的改变，value = fn(time)。 这个ease就是控制这个公式中的fn。
```js
const data = [
  {name: 'Linear', easeFnction: d3.easeLinear },
  {name: 'Cubic', easeFnction: d3.easeCubic },
  {name: 'CubicIn', easeFnction: d3.easeCubicIn },
  {name: 'Sin', easeFnction: d3.easeSin },
  {name: 'SinIn', easeFnction: d3.easeSinIn },
  {name: 'Exp', easeFnction: d3.easeExp },
  {name: 'Circle', easeFnction: d3.easeCircle },
  {name: 'Back', easeFnction: d3.easeBack },
  {name: 'Bounce', easeFnction: d3.easeBounce },
  {name: 'Elastic', easeFnction: d3.easeElastic },
  {name: 'Custom', easeFnction: t => t * t * t * t },
];

const colors = d3.scaleOrdinal(d3.schemeCategory20);

d3.select('body').selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'cell')
  .style('top', (d, i) => {
    return 40 * i + 'px';
  })
  .style('background-color', (d, i) => colors(i))
  .style('color', 'white')
  .style('left', '500px')
  .style('width', '100px')
  .text(d => d.name);

d3.selectAll('div').each( function(d) {
  d3.select(this)
    .transition()
    .ease(d.easeFnction)
    .duration(2000)
    .style('left', '10px')
});

```
## 中间帧
transiton有一个styleTween()方法。
这个方法用于设置中间帧。中间帧的意思是，在关键帧之间插入一些过渡值，这些过度值可以自己定义，也可以用默认d3的实现（随时间线性变化的值）。
先看例子
```js
const body = d3.select('body');
const duration = 5000;
// 默认的
body.append("div").append("input")
  .attr("type", "button")
  .attr("class", "countdown")
  .attr("value", "0")
  .style("width", "150px")
  .transition().duration(duration).ease(d3.easeLinear)
  .style("width", "400px")
  .attr("value", "9");
      
// 自定义
body.append("div").append("input")
  .attr("type", "button")
  .attr("class", "countdown")
  .attr("value", "0")
  .transition().duration(duration).ease(d3.easeLinear)
  .styleTween("width", widthTween) // 并非直接指定最终值而是指定一个计算中间帧函数
  .attrTween("value", valueTween); 
      
      
function widthTween(){
  var interpolate = d3.scaleQuantize()
      .domain([0, 1])
      .range([150, 200, 250, 350, 400]);
  
  return function(t){
      return interpolate(t) + "px";
  };
}
      
function valueTween(){
  var interpolate = d3.scaleQuantize() // 量化比例尺与 linear scales 类似，但是其输出区间是离散的而不是连续的
      .domain([0, 1])
      .range([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  return function(t){  
      return interpolate(t);
  };
} 
```
上面的例子中，如果使用默认的中间值计算，那么按钮中0-9中的数字会线性增长，而且是连续的增长，比如中间可能会出现1.23456这种小数。
指定自定义的中间帧函数，我们可以指定我们期待的中间帧的值，比如说用离散的0， 1， 2... 9。
下面这个函数中，声明了一个scale将连续值转为离散值，然后返回一个参数为t（时间）的函数，d3会将duration转化为[0, 1]然后调用此函数从而得到中间帧需要饿值。
```js
function valueTween(){
  var interpolate = d3.scaleQuantize() // 量化比例尺与 linear scales 类似，但是其输出区间是离散的而不是连续的
      .domain([0, 1])
      .range([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  return function(t){  
      return interpolate(t);
  };
} 
```

## 其他
### transition 级联
级联就是告诉你，transition可以连续使用，就是说可以设置多个连续的动画到对象选集。
```js
function moreTrans(selection) {
  selection.transition().duration(1000)
    .style('width', '200px')
    .style('height', '1px')
    .transition().duration(500)
    .style('left', '600px')
    .transition().duration(1000)
    .style('width', '80px')
    .style('height', '80px');
}

d3.select('body')
  .append('div')
  .attr('class', 'box')
  .style('left', '10px')
  .style('width', '80px')
  .style('height', '80px')
  .call(moreTrans);
```
### filter 选择
filter，过滤出一些需要动画的选集。
selection.transition.filter基本等于selection.filter.transtion。

```js
const data = [
  'Boy', 'Girl', 'Boy', 'Girl', 'Boy', 'Girl',
];

const duration = 1500;

d3.select('body')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'box')
  .style('top', (d, i) => {
    return i * 40 + 'px';
  })
  .style('left', '500px')
  .text(d => d)
  .transition()
  .duration(duration)
  .style('left', '10px')
  .filter(d => d === 'Boy')
  .transition()
  .duration(duration)
  .style('left', '500px');

```
### transition 监听 
设置了transition之后，可以监听这个动画的生命周期，比如start、end事件。

```js
const body = d3.select('body');
const duration = 3000;

const div = body.append('div')
  .classed('box', true)
  .text('waitting')
  .transition().duration(duration)
  .delay(1000) // 为这个 transition 延迟 1000 
  .on('start', function() {
    d3.select(this).text('doing something...')
  })
  .on('end', function() {
    d3.select(this).text('done')
  })

```