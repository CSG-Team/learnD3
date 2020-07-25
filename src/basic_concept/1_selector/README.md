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
[API](https://github.com/d3/d3-selection/blob/master/README.md#selection_selectAll)
再一次的顾名思义了，这个API选中一堆命中的元素，是命中元素的selction对象的集合。
我们拿到一个命中元素的集合，怎么来统一设置属性，这是第一个要解决的问题。
按照常规的思路,假设我们需要统一设置font-size样式,应该这样：
```js
// 错误例子
d3.selectAll('.condition')
  .遍历方法((oneSelection, index)=>{
    oneSelection.style('font-size', '20px');
  });
```
但是用d3这样就没必要了。看清楚，下面的代码是对的：
```js
d3.selectAll('.condition')
  .style('font-size', '20px');

```
不用你去遍历，不用你去遍历，就这样简单、直接就好，这就是d3.js!

还有一个用法是selectAll的参数里面传函数，这个函数一定要有一个数组或者伪数组的返回值来确定你的选择对象，比如，我想选择所有class是cjj的p节点，的所有相邻节点：
```js
d3.selectAll('.cjj')
  .selectAll(function(d, i, n){ // 不用箭头函数
    return [
      // 我是那么的喜欢箭头函数，但是这里的this是当前被遍历节点
      this.previousElementSibling, this.nextElementSibling
    ];
  })

```

## 实在是想遍历...
那当然是有办法的。[API](https://github.com/d3/d3-selection/blob/master/README.md#selection_each)
通过selection.each()方法就可遍历了。
不过，通常这里可能会涉及一个问题：对某个元素操作。
在先前我们假设的遍历代码中：
```js
// 错误例子
d3.selectAll('.condition')
  .遍历方法((oneSelection, index)=>{
    oneSelection.style('font-size', '20px');
  });
```
oneSelection选中集合中的其中一个selection对象。这样没毛病，我们的目的肯定是要拿到某个需要操作的selction对象的。但是d3不是这样上面这样拿，稍微有些不同。
不同在于.each()方法传给回调函数的参数并不是一个selction对象和索引值：
```js
d3.selectAll('.condition')
  .each(function(d, i){
    d3.select(this).style('font-size', '20px');
  });

```
*d3.select(this)* 这么诡异的东西就是在这个回调函数中拿到selection的方法。参数i的确是索引，但是d表示被绑定的数据，是数据，数据驱动的那个数据，细品。数据这里后面会说，莫慌张。
这里的this是这个回调函数的调用者，就是selction本身，所以，用了箭头函数，你的this指向会有问题。

## selection.append()追加子元素
这个就相对简单些。在某元素的selection上调用append，就是给这个元素追加一个子元素，返回子元素的selction。
这个selection是子元素，同时，数据继承自父级。[API](https://github.com/d3/d3-selection/blob/master/README.md#selection_append)

```js
// 这个
d3.selectAll("p").append("div");

// 和这个是等价的
d3.selectAll("p").select(function() {
  return this.appendChild(document.createElement("div"));
});
```

# 一些思考

* selction可以理解为选集，是被d3封装了很多功能，内部包含DOM节点的对象；select()返回的是slection对象,selectAll()返回的也是selction对象，而不是[slection, selection, ...selection]。或者说，selection对象有两种形态：一个selection 以及 类似[slection, selection, ...selection]多个的。

* 到这里也很可能注意到了，select和selectAll方法，我们可以这么用：d3.select()、或者d3.select().select().select()....这样的效果就是搜索条件一步一步紧缩。
但是这里想说的不只是这一点，我们知道d3.select()返回的是一个selction对象，但是selection对象也有select()以及selectAll()方法的。
那么我们可以理解为，select()和selectAll()方法是从属于selection对象的。
可是，这样的话，d3.select()算什么？是不是可以大胆假设下，d3这个对象封装了整个document，在d3.select()的调用中，d3是被当作selction对象的来看待的。
不知道未来有没有时间，小心求证下....

*End～*

# refs:
[Offical API Document: selection](https://github.com/d3/d3-selection/blob/master/README.md#select)