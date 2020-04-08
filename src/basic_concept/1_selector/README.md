# Selector 选择器
既然D3号称要操作Document,那么就是要在Document上做增删改查。
精准的定位要操作的一个或者一组对象往往是首要工作。这就是为什么先来了解选择器。

# 复习：最基本的CSS选择器
* #myId   选中id是myId的元素
* .myClass  选中class是myClass的元素
* [name=abc]  选中属性name是abc的元素
* 也可以组合下，比如 rect.myClass、 或arc#myId选中的是class为myClass的rect元素以及id为myId的arc元素

# d3.js如何选取元素
简而言之，用d3的API通过CSS选择器的写法来选中文档中的元素。

## d3.select(selector) 选取单一元素
[API: d3.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#select)

* 返回命中选择器的第一个元素，就算多个匹配也只是返回一个；
* 如果没有元素与选择器匹配，则返回空selection；
* 返回的东西是selection对象，见下文⬇️；

## selection的概念
Selection其实就是你选择到的节点，被D3封装了一些方法，经由这些方法可以操作这个节点，对就是这么简单。
看看官方怎么解释。

>Selections allow powerful data-driven transformation of the document object model (DOM): set attributes, styles, properties, HTML or text content, and more. Using the data join’s enter and exit selections, you can also add or remove elements to correspond to data.

Selection允许强大的数据驱动的文档对象模型（DOM）转换：设置属性，样式，属性，HTML或文本内容等。使用数据联接的enter和exit，还可以添加或删除与数据相对应的元素。
（细品：正由于selection提供了诸多操作DOM的方法，以及特有的enter和exit，使得由数据变化对应到DOM变化成为了可能）

值得注意的是，基本上selection的方法的返回值还是selction对象。这就可以实现链式调用，写起来简单明了，d3的项目中99%的程序都是这么用的。

通过selection修改属性[API](https://github.com/d3/d3-selection/blob/master/README.md#modifying-elements)：
* selection.attr() 读取或者修改某个属性的值；

```js
// 设置值
d3.select("svg")
  .attr("width", 960)
  .attr("height", 500);

// 获得值
const svgWidth = d3.select("svg").attr("width");

```
* selection.classed() 添加或者删除选中元素的class属性；
```js
// 添加class
d3.select("svg").classed("myClass", true);

// 移除class
d3.select("svg").classed("myClass", false);

// 条件动态添加
selction.classed("myClass", (d, i) => {
  if(/*条件。。。*/) return true;
  return false;

});

```
* selection.style()  加点样式,也支持第二个参数是回调函数动态添加
```js
d3.select('span.title').style('font-size', '20px');

```

* selection.text()  元素中文本的指定,也可以动态添加
```js
d3.select('p').text('Hello D3.js');

```

* selection.html()  元素中html元素(html字符串)的制定，当然支持动态添加
```js
d3.select('p').html('<p>Hello D3.js</p>');

```


## d3.selectAll(selector) 选择多个元素




[selection](https://github.com/d3/d3-selection/blob/master/README.md#select)