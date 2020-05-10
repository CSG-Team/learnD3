# SVG && Using in D3.js
我们使用D3，核心还是操作结构化的标记语言的文档模型（比如先前操作过的HTML的DOM）。这个特点注定了SVG是我们做可视化的主战场----SVG是基于标记语言的，本质上也是一种XML。所以D3的selector、selection.attr()等方法才能在svg中发挥其作用。

## SVG
先简单的介绍下SVG。
SVG(Scalable Vector Graphics)，可伸缩矢量图形。是W3C创建的，用来定义用于网络的基于矢量的图形标准。其核心特点有：
1. 矢量：缩放不失真；
2. 结构化：基于XML描述；所以这一点也可能理解为什么一开始定义里面是用于网络，因为XML的文本相对于位图来讲，省去了多少网络传输成本；

SVG的其他特点，诸如可读性、平台应用广泛等不做赘述。

SVG支持的图形有：
* line 线
* rect 矩形
* circle 圆形
* ellipse 椭圆
* polygon 多边形
* path 路径
* text 文本

一个SVG可能是这样的：

```xml
<svg>
  <line -- attrs -- ></line>
  <path -- attrs -- ></path>
  <text -- attrs -- ></text>
</svg>

```

### SVG 基本图形
line、 circle、 ellipse 、 polygon、 rect这些图形，各有各自的特殊属性。
* (line)[https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line] 需要指定x1, y1, x2, y2;
* (circle)[https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle] 需要指定 x, y, r; 
* (rect)[https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect] 需要指定 x, y, width, height;
* (polygon)[https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon] 需要指定 points;
* (ellipse)[https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse] 需要指定cx, cy, rx, ry;

另外，一些通用的绘图样式属性,可以参考这里 : (SVG Presentation Attributes)[https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation]

### path 元素


## SVG Using in D3.js

d3中使用SVG比较简单，直接在svg中append()元素并在后续的操作中设置属性即可：

```js
const width = 800, height = 500;

const svg = d3.select('body')
  .append('svg');


svg.attr('width', width)
  .attr('height', height);

// line element
svg.append('line')
  .attr('x1', 10)
  .attr('y1', 10)
  .attr('x2', 100)
  .attr('y2', 200)
  .style('stroke', 'red')
  .style('stroke-width', '2px');

svg.append('text')
  .text('line')
  .attr('x', 50)
  .attr('y', 300);

// circle element
svg.append('circle')
  .attr('cx', 250)
  .attr('cy', 150)
  .attr('r', 40)
  .style('fill', 'transparent')
  .style('stroke', 'blue');

svg.append('text')
  .text('circle')
  .attr('x', 230)
  .attr('y', 300);

// rect element
svg.append('rect')
  .attr('x', 400)
  .attr('y', 120)
  .attr('rx', 5)
  .attr('width', 50)
  .attr('height', 50);

svg.append('text')
  .text('rect')
  .attr('x', 410)
  .attr('y', 300);

svg.append('polygon')
  .attr('points', '570,80 530,150 650,220')
  .style('fill', 'transparent')
  .style('stroke', 'blue')
  .style('stroke-width', '2px');

svg.append('text')
  .text('polygon')
  .attr('x', 580)
  .attr('y', 300);

```
这个例子很简单，就不做太多说明了。
大多数时候，我们使用D3都不会写类似上面例子中的代码，因为我们使用最多的是path元素。
path很复杂，不过不用担心，path中核心属性d，d3为我们封装了数据驱动的简单方法，所以在为了的使用d3做可视化的过程中，基本上都是这样的思路:
```js
svg.select('path')
  .data(data)
  .enter()
  .attr('d', function(d){
    return d3封装的函数(d)
  });
```
上面的思路可能会贯穿后续绘图的始终，不过这里，先end。
