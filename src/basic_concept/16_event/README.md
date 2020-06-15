D3 交互事件

## 基本鼠标事件
d3的事件通常加到选区selection上面，通常[DOM Event Type](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events)都是支持的。语法也比较简单，就是selection.on('事件名称', 回调函数)
```js
// d3 event
const r = 300;
const svg = d3.select('body')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)
  .style('border', '1px solid darkgray')


const textEle = svg.append('text')
  .attr('x', 50)
  .attr('y', 50);

// 这里注意下 有什么区别呢？
console.log('svg', svg)
console.log('svg.node()', svg.node())


svg.on('mousemove', ()=>{
  const positionInfo = d3.mouse(svg.node());
  textEle.text(positionInfo);
})

```
上面的Demo中，svg通过on监听了鼠标移动的事件，并将鼠标的位置作为文本显示。
不过这里需要注意的是，这里的位置是通过d3.mouse(svg.node())来拿到的，而不是通过传进来的参数。
[d3.mouse()](https://github.com/xswei/d3-selection/blob/master/README.md#mouse)
> 返回 current event 相对于指定 container 的 x 和 y 坐标。container 可以是一个 HTML 或 SVG 容器元素，比如 G element 或者 SVG element。坐标以二元数组的形式返回

这里的container就是第二个参数，这里需要是一个html或者svg element。svg.node()的结构就是dom元素，而svg是一个选集selection。

## 平移&缩放


```js

const width = 600, height = 350, r = 50;

const data = [
  [width / 2 - r, height / 2 - r],
  [width / 2 - r, height / 2 + r],
  [width / 2 + r, height / 2 - r],
  [width / 2 + r, height / 2 + r]
];

const svg = d3.select("body").append("svg")
  .attr("style", "1px solid black")
  .attr('width', 600)
  .attr('height', 600)
  .style('border', '1px solid darkgray')
  .call(  
    d3.zoom()  
      .scaleExtent([0.1, 10]) 
      .on("zoom", zoomHandler)  
  )
  .append("g");

svg.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("r", r)
  .attr("transform", function (d) {
    return "translate(" + d + ")";
  });

function zoomHandler() {
  const transform = d3.event.transform;
  const { x, y, k } = transform;

  svg.attr("transform",`translate(${x}, ${y})scale(${k})`);
}
```


## 拖拽

to be continue...