# SD 动画框架介绍

SD 动画框架在 svg 之上提供了一个简单的抽象层，对于大部分原始的 svg 元素，将其抽象为 JS 层面的对象，以 rect 元素为例，可以这样去构建与设置其属性：

```js
const svg = sd.svg(); // 获取 svg 画布
const rect = new sd.Rect(svg); // 将 rect 画在 svg 画布上
rect.x(100).width(30); // 设置 rect 拥有的属性，支持链式调用
```

想要获取属性的值，只需要调用同名方法，不传入任何参数即可：

```js
console.log(rect.x()); // 打印 rect 的 x 属性
console.log(rect.width()); // 打印 rect 的 width 属性
```

如果想要支持动画操作，只需要把属性修改操作放在动画区间里面即可完成：

```js
rect.startAnimate(300) // 开启一段 300ms 的动画区间
    .x(100) // 在这段区间里面，把 rect 的 x 属性逐渐改为 100
    .width(30) // 在这段区间里面，把 rect 的 width 属性逐渐改为 30
    .endAnimate(); // 结束动画区间
```

你可以连续创建多个动画区间，这些动画则会顺次执行：

```js
rect.startAnimate(200)./* 做一些 rect 的属性修改 */.endAnimate()  // 第一段动画区间，时间范围 [0ms, 200ms]
    .startAnimate(500)./* 做一些 rect 的属性修改 */.endAnimate(); // 第二段动画区间，时间范围 [200ms, 700ms]
```

如果你希望直接创建一个动画区间 [400ms, 900ms]，你可以使用 after 函数：

```js
rect.after(400) // 直接将 400ms 作为动画区间的起始时间
    .startAnimate(500) // 动画区间持续时长为 500ms
    .x(50) // 设置 rect 被动画化的属性
    .endAnimate(); // 结束动画区间
```

当你希望场景中的内容被暂停一段时间，则可以使用 pause 来实现：

```js
rect1.startAnimate(300).x(100).endAnimate(); // rect1 的动画区间为 [0ms, 300ms]
rect2.after(300).startAnimate(300).y(100).endAnimate(); // rect2 的动画区间为 [300ms, 600ms]
/**
 * 暂停 1000ms
 * 暂停结束后，场景中的所有元素的动画区间又会从 0ms 开始算起
 * 也就是说，每一个元素的动画区间，指的是相对于前一个 pause 而言的偏移量
 */
await sd.pause(1000);
rect1.startAnimate(200).x(200).endAnimate(); // rect1 的这一段动画区间又变成了 [0ms, 200ms]
```

关于框架中具体封装了哪些元素的什么方法，可以参考“封装对象”章节

## 规范

为了更加规范地控制代码风格，以下提供一份有注释的示例代码：

```js
import * as sd from "@/sd"; // 引入 SD 动画框架

const svg = sd.svg(); // 获取 svg 画布
const C = sd.color(); // 获取颜色模块
const R = sd.rule(); // 获取规则模块
const D = sd.device(); // 获取设备模块
const I = sd.input(); // 获取输入的解析模块
/*
... 还有一些全局变量定义在这里，在使用变量的时候尽可能使用 const 来定义
*/

sd.init(() => {
    // 初始化场景的过程可以放在这里面
    // 这里面应该只对场景中的元素进行直接的属性设置，例如 rect.x rect.y
    // 不应该在这里进行任何动画操作
});

sd.main(async () => {
    // 动画的主要实现放这里面
    await sd.pause(1000);
    rect.startAnimate().x(100).y(100).endAnimate();
    await sd.pause(2000);
    rect.startAnimate().width(100).height(100).endAnimate();
    // ...
});
```

## 封装对象

-   公共方法
    -   fill/fillOpacity
    -   stroke/strokeOpacity/strokeDashOffset/strokeDashArray
-   基础图形 SVG 对象
    -   Circle: cx/cy/r
    -   Ellipse: cx/cy/rx/ry
    -   Image: x/y/width/height/href
    -   Polygon: points
    -   Rect: x/y/width/height
-   基础路径 SVG 对象
    -   Line: x1/y1/x2/y2
    -   Path: d
    -   Polyline: points
