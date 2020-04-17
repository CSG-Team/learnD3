# 数据的驱动：Enter-Update-Exit模式

>数据是纯粹的事实。所谓‘纯粹’意味着没有经过任何处理，也没有被揭示意义。信息是数据处理的结果，是数据后面代表的意义。

可视化所做的事情要更近一步。
可视化揭露数据信息的方式，是将其用视觉图形表示。当然同一份数据，其意义可能不唯一，其意义的表述角度当然也会是多元的。换句话讲，同样的可视化数据可以存在不同的可视化形式，每一种形式都可以有其独到的侧重点或者意义。

所以，在任何的可视化工具中，建立数据和图形的联系就自然是重中之重。

这可能是一个繁琐的过程。设想下这个过程，核心就是需要建立数据和图形之间的映射关系。就是建立函数
visual = f(Data)
也许建立对应关系不是很难，不过可能还需要一些善后事宜。试想你的Data是一个动态变化的，那么你的visual就是动态变化的。但这里具体会涉及到图形的增删等处理细节，以及如何最小化代价的处理这些修改。D3为我们提供的方法被称作Enter-Update-Exit模式，如果你要学习D3，这就是首先要了解的。

# Enter-Update-Exit概念

所谓Enter-Update-Exit的概念其实可以理解为状态。
那么是谁的状态，数据的状态？并不完全是数据，是数据和可视化元素绑定为一体后的状态。
先看下这三个状态（假设现在的可视化过程中，数据和元素已经绑定好了）。

假如在某时刻可视化的渲染中，原先的五个元素中要在头部新增一个元素并删除尾部的元素。如图所示。
那么：
1. 对于一直处于可视化状态的四个元素来讲，自己的本质上没有变化，但可能涉及微小的**更新Update**，比如一些位置，色彩等参数上的更新过程；
2. 对于将要被可视化的新元素来讲，就要从数据状态**进入Enter**可视化状态了；
3. 同样，对于要被删除的元素，就要从可视化状态**退出Exit**中了；

也就是说，不同的元素在一次可视化过程中对应不同的角色，有的元素是更新，有的元素是进入，有的是退出；当然也可以想象，在一些特殊时候，所以元素状态都是更新(比如第一次可视化渲染)或者退出状态了。

D3的编程逻辑就是一次性编写好这三种情况：在代码中已经写好如何处理那些需要更新的元素，需要进入和删除的元素。那么，我怎么知道那个元素是什么状态？这个自然是D3负责识别元素的状态。
当数据变更后并绑定后，D3通过对比筛选出各个状态的元素，然后分别对应开发人员针对不同状态编写的逻辑处理这些元素。

那么，我们之前说的 visual = f(Data) 过程就建立起来了。而且，开发这面对每次变化都是甩手掌柜，数据变化，可视化结果就会变化，其变化完全是由数据驱动的。

Wait A minute～数据驱动这个高大上的词语，就这么被自然而然的引出来了？
是的...什么是D3，D3就是 D * 3，三个大写D简称D3，Data Driven Document。

# Demos for API Explanation

上面的概念理解之后，我们通过例子来看这些概念的具体API实现。
这是一个简单的例子。renderData函数是可视化的方法，在首次调用之后，没过1s后，数据改变，然后重新调用可视化方法。最终的效果是每秒钟可视化图形都在随着数据变化：

```js
const data = [10, 20, 30, 40, 50];
// 可视化
renderData(data);

// 定时更新数据并可视化
setInterval(() => {
  // 改变数据
  data.shift();
  data.push(Math.random() * 100);
  // 重新可视化
  renderData(data);
}, 1000);

function renderData(data) {
  // update state
  const bars = d3.select('.container')
    .selectAll('div.bar')
    .data(data)
    .style('width', d => d * 5 + 'px' )
    .style('height', 10 + 'px')
    .style('border', '1px solid black');

  // enter
    bars.enter()
    .append('div')
    .attr('class', 'bar')
    .style('width', d => d * 5 + 'px' )
    .style('height', 10 + 'px')
    .style('border', '1px solid black');

  // exit
  bars.exit()
    .remove()
 }
```
* 绑定(bind)
绑定是可视化的第一步，API是selection.data(data)。
绑定后返回的还是selection，方便链式调用（seletion是选集）。绑定的目的是将选集和数据建立关系，或者说用选集对象封装了数据，数据在这个对象中的属性是双下滑线data双下滑线。
绑定数据是要做的第一步。

* 更新(update)
[API](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_data)
其实更新和绑定是一个API，我们调用selection.data(data)的绑定后的数据后返回的那个选集就是需要update的元素的选集。
那么我们对应的更新操作就在这个选集中处理就好:
```js
const bars = d3.select('.container')
  .selectAll('div.bar')
  .data(data) // 自此之后返回了update状态的选集
  .style('width', d => d * 5 + 'px' )
  .style('height', 10 + 'px')
  .style('border', '1px solid black');
``` 
* 进入(enter)
[API](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_enter)
selection.enter()函数是选择那些进入状态的选集。

```js
bars.enter()
  .append('div')
  .attr('class', 'bar')
  .style('width', d => d * 5 + 'px' )
  .style('height', 10 + 'px')
  .style('border', '1px solid black');
```
这里注意，因为是进入状态，所以要有添加元素的过程，代码中的:

```js
  .append('div')
  .attr('class', 'bar')
```

* 退出(exit)
[API](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_exit)
selection.exit()选择那些退出状态的选集。

* merge函数
[API](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_merge)
selection.merge()函数也是很常用的函数，是将两个过程合并处理。因为有些处理过程可能一样的。

比如，在上面的例子中update和enter后都是相同的处理逻辑，那么这个时候写重复的代码就没有意义了。具体这样处理,是不是很简单：

```js
function renderData(data) {
  // update state
  const bars = d3.select('.container')
    .selectAll('div.bar')
    .data(data);
  // enter
    bars.enter()
    .append('div')
    .attr('class', 'bar')
    .merge(bars) // 适当的位置合并处理
    .style('width', d => d * 5 + 'px' )
    .style('height', 10 + 'px')
    .style('border', '1px solid black');

  // exit
  bars.exit()
    .remove()
}
```
selection.merge(otherSeletion)函数的参数是某一个状态的选集，就是将某个状态的选集(otherSeletion)和当前选集合并(selection)处理，一定要在合适的位置（公共代码出现前）调用merge()。

# 其他
* 绑定之后的可视化选集元素在设置属性的时候有这几种方式：
1. 直接设置值
```js
.style('height', 10 + 'px')
```
2. 设置和原始数据相关的值
```js
// 这里 d就是原始数据
.style('width', d => d * 5 + 'px' )
```
所以假设原始数据是对象的集合，这里可能出现这样的代码：
```js
// 这里 d就是原始数据
.style('width', d => d.value * 5 + 'px' )
```
关于稍微复杂点的数据，这里有[DEMO](https://github.com/CSG-Team/learnD3/tree/master/src/basic_concept/2_data_bind_visual)

* 参考了解：[D3’s data join 让你更加明晰数据的变化](https://observablehq.com/@d3/selection-join)



