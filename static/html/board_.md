文档 http://dsmorse.github.io/gridster.js/


gridster可以在console中直接操作。

gridster.baseX和baseY用来设置拖动时可放置的网格间距，比如设baseX为400，则只在x%400==0的位置显示阴影。

---------
现在拖动方块时，只要有碰撞，被碰撞的方块都会被挤到下方，
需要参照SwapDrop.html启用swap，使小块不能挤走大块，但是大块可以和小块换位？(SwapDrop.html好像有bug)
---------

添加方块：
有很多参数……
第一个是内部文字，第二三个是长宽，第四五个是左边x,y。
如果不设置添加时的坐标，会自动在第一行最后面添加方块。
gridster.add_widget('<li class="new">The HTML of the widget...</li>', 1, 1);
gridster.add_widget('<li class="new">The HTML of the widget...</li>', 1, 1,5,2);
此外后面还有三个参数，作用不明。
在加载html时，方式和add很像，如果html里有重复的条目这种错误，重复的方块会被放在后面。



--------------------
## 含内部文字的序列化输出
方块里的字可用gridster.$widgets[0].textContent="xxx"进行设置，序列化的时候，要输出方块的坐标和对应的内部文字即可。 (innerText也可，但不是w3c标准, 带html标签可以用innerHtml,不过最好是在css定义样式)
根据serialize_param，貌似使用serialize()功能，好像只能得到坐标，并不能得到 textContent ，
所以如果要同时序列化内部文字，恐怕要自己实现serialize功能，遍历每个widget进行处理：

两种方式获取gridster的DOM对象均可：
```js
$(".gridster ul li")[0]
<li data-row=​"1" data-col=​"1" data-sizex=​"2" data-sizey=​"2" class=​"gs-w" >​Hello​</li>​ 
gridster.$widgets[0]
<li data-row=​"1" data-col=​"1" data-sizex=​"2" data-sizey=​"2" class=​"gs-w" >​Hello​</li>​
```
使用方法：
` arr = gridster.serialize($(gridster.$widgets[0])) `
  （传入的参数需要有.each()函数，而$().each()是jQuery遍历数组的方法。）
返回：[{…}]
用 arr[0] 可取到{col: 1, row: 1, size_x: 2, size_y: 2}，类型是object。
所以完整序列化代码应该是：

```js
$('.js-seralize').on('click', function () {
    let s = []
    gridster.$widgets.each(function(i){  // map格式存储，i只是index
        w = gridster.$widgets[i]
        arr = gridster.serialize($(w))
        arr[0].text = w.textContent
        s = s.concat(arr)
    })
    $('#log').val(JSON.stringify(s));
})
```
> 参考：$.each()和$().each(),以及forEach()的用法 
> https://blog.csdn.net/weixin_35809316/article/details/80506857
--------------------
