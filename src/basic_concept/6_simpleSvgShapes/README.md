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

path元素是最复杂的，但核心的属性只有一个: d。
d表示path的路径，其内容是一串命令，如下，这些命令大写表述绝对坐标，小写表示相对坐标：
* M ：移动到某点（不画线）
* L ：画直线到点
* H ：绘制水平线到坐标位置
* V ：绘制竖直线到坐标位置
* C ：三阶贝塞尔曲线
* S ：快捷光滑的三阶贝塞尔曲线
* Q ：二阶贝塞尔曲线
* T ：快捷光滑二阶贝塞尔曲线
* A ：弧形
* Z ：闭合图形

* 贝塞尔曲线
> 贝塞尔曲线(Bézier curve)，贝塞尔曲线于1962，由法国工程师皮埃尔·贝塞尔（Pierre Bézier）所广泛发表，他运用贝塞尔曲线来为汽车的主体进行设计。贝塞尔曲线最初由Paul de Casteljau于1959年运用de Casteljau演算法开发，以稳定数值的方法求出贝兹曲线。现在应用于二维图形应用程序的数学曲线。一般的矢量图形软件通过它来精确画出曲线，贝塞尔曲线由线段与节点组成，节点是可拖动的支点，线段像可伸缩的皮筋，我们在绘图工具上看到的钢笔工具就是来做这种矢量曲线的。贝塞尔曲线是计算机图形学中相当重要的参数曲线。

上面的介绍中，贝塞尔曲线的重要元素是：锚点和线段。我们在ps钢笔工具中的体验是，锚点表示曲线关键点，这个线段(手柄)就是控制关键点处曲率大小和方向的线段。

* 二阶贝塞尔曲线
二阶贝塞尔曲线就是说，某一段曲线的起点和终点间，有一个控制点。对应到ps中其实就是我们绘制的一段曲线中，两个锚点位置定了，现在的变量就是线段（手柄）的方向和大小。在二阶贝塞尔曲线中，这个控制点的位置确定了这个变量。
详细点，svg的二阶贝塞尔曲线当前点就是起点，还需要设置控制点和终点，其中，起点和控制点的连线表示起点处曲率的方法，连线的长度表示该店曲率大小，这样一条曲线就能完全确定下来。

二阶贝塞尔曲线用Q命令
下面的代码中起点是(10, 80)，控制点(95, 10), 终点(180, 80):
```xml
  <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>

```

二阶贝塞尔曲线的另一个用法叫光滑二阶贝塞而曲线，用命令 T。
T命令用于快捷的构建后续的二阶贝塞尔曲线，所谓后续的曲线，意味着在使用T之前必须存在二阶贝塞尔曲线。另外，之所以快捷，是因为T后面只用跟一个结束点作为参数就好了。
T，会以上一段二阶曲线的结束点为起点，以上一段曲线的控制点和上一段曲线结束点所在直线上，以结束点为对称中心的控制点的对称点为新的对称点，这样构建一条新的曲线。
所谓光滑，我们从数学上分析链接处的这个点，两个曲线控制点在同一条直线上，对这个连接点求导，其左导数 = 右导数 ，那么曲线在这个点上就是光滑的。

```xml
<path d="M10 80 Q 52.5 10, 95 80 T  180 80" stroke="black" fill="transparent"/>

```

* 三阶贝塞尔曲线

三阶贝塞尔曲线和二阶贝塞尔曲线差不多。
我们在ps中使用钢笔时候，一段曲线，可能起点有控制点（手柄），但是终点没有，对这段曲线来讲，确定其位置参数是：起点坐标、终点坐标、起点控制点坐标（起点坐标和起点控制点坐标组成的线段就是ps中的锚点手柄，其大小表示曲率大小，方向表示锚点曲率方向）。
我们的曲线还有另外一种情况，就是起点也用控制点，终点也有控制点，那么这时候对于曲线来见，确定位置的参数是：起点坐标、终点坐标、起点控制点的坐标、终点控制点的坐标。这中情况就是三阶贝塞尔曲线。Easy, ha, isn't it？

那么SVG中，我们有C命令和S命令辅助生成三阶贝塞尔曲线。
C 命令以当前点位置为起点，依次设置 起点控制点坐标、终点控制点坐标、结束点
S 命令以上一条三阶贝塞尔曲线的终点为起点，设置两个参数终点控制点坐标、结束点就行，其中起点控制点对称上一条终点控制点算出。类似二阶中T命令。

关于path就简单说这里了。
这篇 (svg之path详解)[https://www.jianshu.com/p/c819ae16d29b] 例子更为详细，可以参考。

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
