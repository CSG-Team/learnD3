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



## 平移缩放