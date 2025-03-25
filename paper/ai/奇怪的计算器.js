/*

luogu P4041

## 需求文档

### 1. 初始化阶段

1. **画布初始化**：
   - 使用 `sd.svg()` 创建一个 SVG 画布。
   - 使用 `sd.div()` 创建一个 DIV 画布，用于放置交互元素。

2. **计算器初始化**：
   - 使用一个变量来存储当前结果值，初始值由用户输入。
   - 使用 `sd.Text` 组件来显示当前计算器的操作指令序列，例如：“+5, -3, *2, -7, @2”。
   - 使用 `sd.Text` 组件来显示当前计算器存储结果变量的值范围（即 $L$ 到 $R$ 之间的值）。

3. **用户输入初始化**：
   - 使用 `sd.Input` 组件来接收用户输入的初始值 $X$，并验证输入值是否在 $L$ 到 $R$ 的范围内。
   - 使用 `sd.Button` 组件来触发计算器执行预设的指令序列。

4. **折线图初始化**：
   - 使用 `sd.PathPen` 结合 `sd.Path` 绘制折线图，以展示计算过程中值的变化。
   - 使用两个水平的 `sd.Line` 表示 $L$ 和 $R$ 这两个边界，分别位于画布上表示值 $L$ 和 $R$ 的位置。

### 2. 主要动画阶段

1. **指令执行动画**：
   - 对于每一条指令，使用 `sd.Text` 组件来显示当前执行的指令，例如：“+5”。
   - 使用一个变量来存储当前结果值，如果结果值超过 $R$，则结果值被修正为 $R$，如果结果值小于 $L$，则结果值被修正为 $L$。  
   - 对于指令“+a”，将当前结果值加上 $a$，并检查是否超出范围，如果超出，将结果值修正为 $R$ 或 $L$。
   - 对于指令“-a”，将当前结果值减去 $a$，并检查是否超出范围，如果超出，将结果值修正为 $R$ 或 $L$。
   - 对于指令“*a”，将当前结果值乘以 $a$，并检查是否超出范围，如果超出，将结果值修正为 $R$ 或 $L$。
   - 对于指令“@a”，将当前结果值加上 $a \times X$，其中 $X$ 是用户最初输入的值，并检查是否超出范围，如果超出，将结果值修正为 $R$ 或 $L$。

2. **结果值变化动画**：
   - 使用 `sd.PathPen` 结合 `sd.Path` 绘制折线图，以动态展示结果值的变化过程。折线图的横轴表示指令执行的步骤，纵轴表示结 果值。
   - 如果结果值超过 $R$，则结果值被修正为 $R$，如果结果值小于 $L$，则结果值被修正为 $L$，折线图在超出范围时应该显示修正后的结果值。
   - 使用 `sd.Text` 组件来显示每一步操作后的结果值，并在结果值超出范围时显示修正后的结果值。

### 3. 交互式设计

1. **用户输入交互**：
   - 使用 `sd.Input` 组件来接收用户输入的初始值 $X$，并验证输入值是否在 $L$ 到 $R$ 的范围内。
   - 使用 `sd.Button` 组件来触发计算器执行预设的指令序列，并展示每一步操作的过程和结果值的变化。

2. **指令序列交互**：
   - 指令序列被硬编码到 `operators` 数组中，因此不需要用户输入指令序列。

### 4. 布局设计

1. **画布布局**：
   - 将 SVG 画布和 DIV 画布并排或上下排列，确保用户能够清晰地看到计算器的操作过程和结果值的变化。
   - 将用户输入框和按钮放置在 DIV 画布上，确保用户能够方便地输入初始值并触发计算器操作。

2. **计算器操作显示布局**：
   - 将计算器操作指令序列显示在画布的上方或左侧，确保用户能够清晰地看到当前执行的指令。
   - 将结果值的变化过程显示在画布的中心位置，确保用户能够清晰地看到每一步操作后的结果值。

3. **结果值显示布局**：
   - 将结果值的变化过程以动态的方式展示在画布上，使用 `sd.PathPen` 结合 `sd.Path` 绘制折线图，并在结果值超出范围时显示修 正后的结果值。
   - 使用两个水平的 `sd.Line` 表示 $L$ 和 $R$ 这两个边界，分别位于画布上表示值 $L$ 和 $R$ 的位置。

*/

/*
评价：
捏造方法：
Input.fontSize，Input.placeholder。
Button.fontSize，Button.background。
错误使用：
sd.pause(里面乱传了一个参数)，AI似乎认为这里面传的参数代表暂停时间。
没有任何逻辑错误。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

// 预设指令序列
const N = 5,
    L = 1,
    R = 6;
const operators = [
    { type: "+", value: 5 },
    { type: "-", value: 3 },
    { type: "*", value: 2 },
    { type: "-", value: 7 },
    { type: "@", value: 2 },
];

// 显示计算器操作指令序列
const instructionsText = new sd.Text(div)
    .text(operators.map(op => `${op.type}${op.value}`).join(", "))
    .x(10)
    .y(20)
    .fontSize(16)
    .color(C.black);

// 显示计算器存储结果变量的值范围
const rangeText = new sd.Text(div).text(`存储范围: [${L}, ${R}]`).x(10).y(40).fontSize(16).color(C.black);

// 用户输入框
const input = new sd.Input(div).x(10).y(60).width(100).height(30);

// 执行按钮
const button = new sd.Button(div).x(120).y(60).width(100).height(30).text("执行").color(C.white);

// 结果值显示
const resultText = new sd.Text(div).x(10).y(100).fontSize(16).color(C.black).text("结果值: ");

// 折线图初始化
let pathPen = new sd.PathPen();
let path = new sd.Path(svg).d(pathPen).strokeWidth(2).stroke(C.blue).fill("none");
const yScale = 20; // 纵轴缩放比例，将结果值映射到画布上的位置
const xScale = 50; // 横轴缩放比例，表示指令执行的步骤

// 绘制表示 L 和 R 的边界线
const lineL = new sd.Line(svg)
    .x1(0)
    .y1(0 * yScale + 200)
    .x2(operators.length * xScale)
    .y2(0 * yScale + 200)
    .stroke(C.red)
    .strokeWidth(1);
const lineR = new sd.Line(svg)
    .x1(0)
    .y1((R - L) * yScale + 200)
    .x2(operators.length * xScale)
    .y2((R - L) * yScale + 200)
    .stroke(C.red)
    .strokeWidth(1);
const textL = new sd.Text(svg)
    .text(`L=${L}`)
    .x(operators.length * xScale + 10)
    .y(0 * yScale + 200)
    .fontSize(12)
    .color(C.red);
const textR = new sd.Text(svg)
    .text(`R=${R}`)
    .x(operators.length * xScale + 10)
    .y((R - L) * yScale + 200)
    .fontSize(12)
    .color(C.red);

// 主要动画阶段
sd.main(async () => {
    // 这里可以放置一些初始化动画逻辑，但这里似乎没有实际逻辑，所以留空
});

// 交互式设计
button.onClick(() => {
    sd.inter(async () => {
        const X = parseInt(input.value());
        if (isNaN(X) || X < L || X > R) {
            resultText.text("结果值: 输入值不在有效范围内");
            return;
        }
        let currentResult = X;
        // 重新初始化 pathPen 和 path
        pathPen = new sd.PathPen();
        path = new sd.Path(svg).d(pathPen).strokeWidth(2).stroke(C.blue).fill("none");
        pathPen.MoveTo(0, (currentResult - L) * yScale + 200);
        resultText.text(`结果值: ${currentResult}`);

        for (let i = 0; i < operators.length; i++) {
            const op = operators[i];
            switch (op.type) {
                case "+":
                    currentResult += op.value;
                    break;
                case "-":
                    currentResult -= op.value;
                    break;
                case "*":
                    currentResult *= op.value;
                    break;
                case "@":
                    currentResult += op.value * X;
                    break;
            }
            if (currentResult > R) {
                currentResult = R;
            } else if (currentResult < L) {
                currentResult = L;
            }
            pathPen.LinkTo((i + 1) * xScale, (currentResult - L) * yScale + 200);
            path.d(pathPen.toString());
            resultText.text(`结果值: ${currentResult}`);
            await sd.pause();
        }
    });
});
