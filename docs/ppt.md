# ppt 创作概览

ppt 的创作使用了 reveal.js 框架的魔改版 —— myreveal.js

## 引用框

在 myreveal.js 中，新增了 `quote` 样式，用来把文本放进一个“引用框”

```html
<p class="quote">一些文本</p>
```

这种样式经常用来引用已有的文献、举例子、或者放一些启发性的提问

## 代码块

你可以通过 `codeblock` 标签来创建一个代码块

```html
<codeblock>
    <script type="text/template">
        #include <iostream>
        using namespace std;
        int main() {
            return 0;
        }
    </script>
</codeblock>
```

## 数学公式

直接用美元符号当标识符，即可创建数学公式

```html
<p>$a$ 是一个变量</p>
<p>$$a^2+b^2=c^2$$</p>
```

对于多行数学公式，可以通过 `math-fragment`，让每一行数学公式依次浮现，多行数学公式包括

```html
<p>
    $$ \begin{aligned} a_i&=(a_i-a_{i-1})+(a_{i-1}-a_{i-2})+...+(a_3-a_2)+(a_2-a_1)+a_1 \\
    &=d_i+d_{i-1}+...+d_3+d_2+d_1=\sum_{k=1}^id_k \end{aligned} $$
</p>
```

```html
<p>
    \begin{cases} f_{i,x,y} \rightarrow f_{i+1,a_{i+1}, y } & x\lt a_{i+1} \\ f_{i,x,y} \rightarrow f_{i+1,x, a_{i+1} }
    & y\lt a_{i+1} \\ f_{i,x,y} \rightarrow f_{i+1,-a_{i+1}, y } & x\lt -a_{i+1} \\ f_{i,x,y} \rightarrow f_{i+1,x,
    -a_{i+1} } & y\lt -a_{i+1} \end{cases}
</p>
```

## 动画

可以通过在 iframe 上添加 data-animation 属性，来引用一个动画

```html
<iframe data-animation="./动画.js" style="width: 1000px; height: 300px;"></iframe>
```

最佳实践是把对动画的解释，和动画本身放在同一张 ppt 上，例如

```html
<div style="display: flex; align-items: center;">
    <div>
        <p>AC自动机实际上由两棵树构成，一棵trie树，一棵失配树</p>
        <p class="fragment">沿着trie树往下走，本质上是字符串的延拓的过程</p>
        <p class="fragment quote">
            $$1\rightarrow 2\rightarrow 3\rightarrow 4$$ $$空串\rightarrow a\rightarrow ab\rightarrow aba$$
        </p>
        <p class="fragment">沿着失配树往上走，本质上是在切削字符串，留下字符串的某个后缀部分</p>
        <p class="fragment quote">
            $$6\rightarrow 4\rightarrow 8\rightarrow 2\rightarrow 1$$ $$ababa\rightarrow aba\rightarrow ba\rightarrow
            a\rightarrow 空串$$
        </p>
    </div>
    <iframe data-animation="./双视图.js" style="width: 1000px; height: 500px;"></iframe>
</div>
```

## ppt 风格

使用中文编写 ppt，在 ppt 中不要出现句号、冒号，不要出现大篇幅的代码块

ppt 尽可能具有启发性

-   在解释题目做法的时候，不要阐述代码的每一个步骤，而是从更高的一个纬度讲解为什么要这么做
-   在讲算法模板的时候，可以分布阐述代码，但也必须讲清楚为什么这么做

对于一个知识点，不同的章节放在不同的文件夹下，参考以下组织形式（以二分图最大匹配的 ppt 为例）

尽量用简单的短语或者简短的句子组织 ppt，给老师更多的发挥空间，少文字，多动画

```
.
├── ppt.html // 主要入口
├── 二分图最大匹配概述 // 介绍二分图的一些讲解
│   ├── ppt.html // 二分图最大匹配 ppt 的入口
│   ├── 匹配与最大匹配.js // 辅助动画
│   ├── 染色.js
│   ├── 增广路.js
│   └── 最大匹配.js
├── 宫廷守卫
│   └── ppt.html
├── 矩阵游戏
│   ├── ppt.html
│   ├── 矩阵游戏.cpp
│   ├── 矩阵游戏问题转换.js
│   └── 矩阵游戏中的不变量.js
......
```
