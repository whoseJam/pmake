/*

luogu P3208

### 一、动画主题
通过可视化动画展示根据 $2\times 2$ 子矩阵和推算原矩阵的过程，以及体现字典序最小矩阵的求解思路。

### 二、动画场景设计
1. **初始界面**
    - 有一个网格区域用于展示输入的以格子 $(i,j)$ 为右下角的 $2\times 2$ 子矩阵中的数的和（输入格式中的后续 $n$ 行数据）。
    - 旁边有一个“初始化”按钮。
2. **计算过程展示**
    - 当点击“初始化”按钮后，动画开始。
    - 首先展示初始化的过程，在画面中绘制一个空白的 $n\times m$ 矩阵框架，准备填入数据。
    - 以动态的方式，开始随机生成第一行的数据与第一列。
    - 在确定第一行数据与第一列数据后，展示根据第一行和第一列数据逐步填充整个矩阵的过程。每个填充的格子会以淡入的效果出现数值，并且有线条连接相关的 $2\times 2$ 子矩阵区域，展示数据之间的推导关系。

### 三、交互设计
1. 点击“初始化”按钮触发动画。

### 四、元素设计
1. **矩阵**：可以用 sd.Grid，以表格形式呈现，格子有一定的边框和填充颜色，方便区分不同的格子。
2. **按钮**：可以用 sd.Button 设计简洁，有明显的点击反馈效果，如颜色变化或轻微的动画效果。
3. **数值显示**：可以用 sd.Grid 的 insert 或者 value 方法，在格子内和相关提示区域，以清晰易读的字体显示数值。
5. **辅助线条和标记**：用不同颜色的线条和标记来展示数据之间的关系、范围变化以及比较字典序时的关键位置。 

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const D = sd.device();

// 创建按钮
const initButton = new sd.Button(svg).x(100).y(100).text("初始化");
// 假设 n 和 m 为矩阵的大小，这里先设定为 3 和 3，实际应用中可以根据需求调整
const n = 3;
const m = 3;
const data = [
    [0, 0, 0],
    [0, 4, 5],
    [0, 5, 3],
];
// 创建矩阵
const matrixGrid = new sd.Grid(svg).x(200).y(100).n(n).m(m);
const sumGrid = new sd.Grid(svg)
    .x(matrixGrid.mx() + 80)
    .y(matrixGrid.y())
    .n(n)
    .m(m);

// 初始化设置
sd.init(() => {
    // 设置按钮点击事件
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) sumGrid.value(i, j, data[i][j]);
    initButton.onClick(() => {
        sd.inter(async () => {
            await randomFillGrid();
        });
    });
});

sd.main(async () => {
    const focus1 = sd.Focus(matrixGrid);
    const focus2 = sd.Focus(sumGrid);
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < m; j++) {
            await sd.pause(sd.CONTINUE_FRAME);
            focus1
                .startAnimate()
                .focus(i - 1, j - 1, i, j)
                .endAnimate();
            focus2.startAnimate().focus(i, j).endAnimate();
            const l1 = new sd.Line(svg).source(focus1.pos("x", "y")).target(focus2.pos("x", "y"));
            const l2 = new sd.Line(svg).source(focus1.pos("mx", "y")).target(focus2.pos("mx", "y"));
            const l3 = new sd.Line(svg).source(focus1.pos("x", "my")).target(focus2.pos("x", "my"));
            const l4 = new sd.Line(svg).source(focus1.pos("mx", "my")).target(focus2.pos("mx", "my"));
            const lines = [l1, l2, l3, l4];
            lines.forEach(line => line.stroke(C.red).startAnimate().pointStoT().endAnimate());
            await sd.pause(sd.CONTINUE_FRAME);
            lines.forEach(line => line.startAnimate().fadeStoT().endAnimate());
        }
    }
    await sd.pause(sd.CONTINUE_FRAME);
    focus1.startAnimate().focus(null).endAnimate();
    focus2.startAnimate().focus(null).endAnimate();
});

async function randomFillGrid() {
    // 生成第一行与第一列的数据
    matrixGrid.startAnimate();
    matrixGrid.value(0, 0, sd.rand(0, data[1][1]));
    for (let i = 1; i < n; i++) {
        const sum = matrixGrid.intValue(i - 1, 0);
        matrixGrid.value(i, 0, sd.rand(0, data[i][1] - sum));
    }
    for (let j = 1; j < n; j++) {
        const sum = matrixGrid.intValue(0, j - 1) + matrixGrid.intValue(1, j - 1);
        matrixGrid.value(0, j, sd.rand(0, data[1][j] - sum));
    }
    matrixGrid.endAnimate();
    // 填充整个矩阵
    await sd.pause();
    matrixGrid.forEachElement((element, rowId, colId) => {
        if (rowId * colId === 0) {
            element.startAnimate().value(null).endAnimate();
        }
    });
}
