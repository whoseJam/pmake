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

## SVG 画布

画布是一个宽度为 1200，高度为 600 的区域（单位统一为 pixel），画布的大小是无法修改的

画布左上角的坐标为 (0, 0)，画布右下角的坐标为 (1200, 600)

在场景中创建元素时，需要尽量让元素居中，尽量避免重要元素之间的遮挡，保证视觉上的美观

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

你应该只使用这些对象进行创作

-   公共方法
    -   width/height：用于调整元素大小，所有元素都拥有这些方法（即使没有对应的属性，也可以找到类似的等价属性，比如 circle 的 width 就被定义为其 r 的两倍）
    -   x/y/cx/cy/mx/my：用于实现元素的定位，其中 x/y 表示一个元素左上角的坐标；cx/cy 表示一个元素的中心坐标，mx/my 表示一个元素右下角的坐标
    -   fill/fillOpacity：用于设置元素的填充属性
    -   stroke/strokeOpacity/strokeDashOffset/strokeDashArray：用于设置元素的描边属性
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
-   基础文字 Text 对象
    -   Text: text/fontSize
-   其他重要对象
    -   Caption: 字幕对象，使用 caption 方法更新中英双语字幕，在创作教学动画的时候必须在场景中加入字幕讲解

当操作元素进行布局的时候，尽可能先设置大小，再设置位置，举个例子：

```js
rect.width(50).cx(80); // 这个 rect 能精准地让自己的中心位于 80 处
rect.cx(80).width(50); // 这个 rect 的中心不一定最后落在 80 处，因为它先调用了 cx 方法去设置中心 x 坐标，再修改了自己的宽度，宽度修改后中心是否还位于 80 就不确定了
```

## 颜色

颜色模块通过 `sd.color()` 来获取，在颜色模块中定义了很多预设的颜色，调用方法形如：

```js
const C = sd.color();
rect.startAnimate(300).color(C.red).endAnimate(); // 把 rect 的填充设置为红色
circle.startAnimate(400).fill(C.purple).endAnimate(); // 把 circle 的填充设置为紫色
ellipse.startAnimate(500).stroke(C.green).endAnimate(); // 把 ellipse 的描边设置为绿色
polygon.startAnimate(350).color(C.BLUE).endAnimate(); // 把 polygon 设置为蓝色系（同时设置填充为浅一点的蓝色，描边为深一点的蓝色）
```

颜色模块中全大写的预设颜色，同时定义了填充颜色和描边颜色；而小驼峰命名的预设颜色，则只定义了单一颜色，具体会设置到描边色还是填充色上取决于对象被调用的方法是 fill 还是 stroke

## 字幕

场景中应该恰好有一个字幕，字幕需要写中英双语

```js
const caption = new sd.Caption(svg);
caption.cx(600).my(600); // 将字幕放在合适的位置
await sd.pause(600);
caption
    .startAnimate()
    .caption("中文字幕放这里", "English caption put here") // 切换字幕内容
    .endAnimate();
```

## 动画风格

请你生成一个非常精美的动画，要像一个完整的，正在播放的视频，包含一个完整的过程，能把知识点讲清楚，页面极为精美，好看，有设计感，同时能够很好的传达知识，知识和图像要准确，附带一些旁白式的文字解说（用 Caption 来实现），从头到尾讲清楚一个小知识点

使用和谐好看，广泛采用的浅色配色方案，使用很多的，丰富的视觉元素，请保证任何一个元素都被放在了画布中，避免字幕遮挡，图形位置错误等等问题影响正确的视觉传达

以下是一些小动画的设计，你可以参考

```js
// 一个横向浮现效果
const text = new sd.Text(svg, "Hello")
    .opacity(0) // 让文本透明
    .x(500) // 初始化 text 的 x 坐标
    .y(100) // 初始化 text 的 y 坐标
    .startAnimate(300)
    .x(510) // 让文本往右移动一小段距离
    .opacity(1) // 让文本浮现出来
    .endAnimate();
```

```js
// 一个文字切换效果
text.startAnimate(200) // 第一段动画区间，让文本消失
    .opacity(0) // 让文本透明
    .endAnimate()
    .text("Hello") // 切换文本内容
    .startAnimate(200) // 第二段动画区间，让文本重新出现
    .opacity(1) // 让文本浮现出来
    .endAnimate();
```

```js
// 一个元素弹出效果
const circle = new sd.Circle(svg)
    .cx(600)
    .cy(200)
    .r(0) // 让 circle 为一个不可见的点
    .color(C.GREEN) // 同时设置 circle 的填充和描边为绿色系
    .startAnimate()
    .r(20) // 让 circle 生长出来
    .endAnimate();
```

```js
// 一个文字变红强调效果
const text = new sd.Text(svg, "Hello").cx(100).cy(100);
await sd.pause();
text.startAnimate(300)
    .fontSize(25)
    .color(C.red)
    .cx(100) // 重新调整文字的中心是有必要的，因为文字的字体大小变化了，中心会偏移
    .endAnimate()
    .startAnimate(300)
    .fontSize(20)
    .color(C.black)
    .cx(100) // 重新调整文字的中心是有必要的，因为文字的字体大小变化了，中心会偏移
    .endAnimate();
```
