/*
luogu P1018

### 需求描述
实现一个包含数码、间隔、乘号插入及实时计算功能的交互场景。具体要求如下：
1. **数码与间隔结构**：存在 `n` 个数码，这些数码中间有 `n - 1` 个间隔，每个间隔都具备插入乘号的功能。
2. **乘号使用限制**：总共只有 `k` 个乘号可供使用，即所有间隔中同时最多只能放置 `k` 个乘号。
3. **按钮交互逻辑**：提供 `n - 1` 个按钮，每个按钮对应一个间隔。每次点击按钮，该按钮对应的间隔会在插入乘号和取消乘号之间进行切换。例如，首次点击按钮，会在对应的间隔插入乘号；再次点击同一个按钮，则会取消该间隔的乘号。
4. **实时计算功能**：每当按钮点击操作导致乘号的放置情况发生变化时，需要实时更新并计算插入乘号后的表达式的结果。    

 */
import * as sd from "@/sd";
const svg = sd.svg();
const div = sd.div();

// 题目数据
let N = 4; // 字符串长度
let K = 2; // 乘号数量
let digits = [1, 2, 3, 1]; // 数字串，这里以数组的形式表示
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();

// 数组元素，用于显示数字
const ARRAY_COLOR = C.BLUE;
const digitArray = new sd.Array(svg)
    .resize(N)
    .range(0, N)
    .labels(Array.from(digits).map(String))
    .color("white")
    .forEachElement((item, i) => {
        item.color(ARRAY_COLOR).strokeColor(ARRAY_COLOR.fill).strokeWidth(3);
    })
    .y(0)
    .x(20)
    .scale(2)
    .fontSize(30)
    .shape("rounded-rect");

// 间隔的按钮数组
const buttons = [];
const buttonWidth = 40; // 按钮的宽度
const signArray = [];
const buttonGap = 20;
let totalMultiplicationSigns = 0; // 当前已放置的乘号数量

// 在数字之间创建按钮，用于处理乘号的插入和移除
for (let i = 0; i < N - 1; i++) {
    const btnDiv = sd.div(div); // 使用原生div作为按钮的容器，因为Button已不复用。

    const btn = new sd.Circle(btnDiv) // 使用sd.Button来生成按钮
        .x(i === 0 ? buttonWidth : i * (2 * buttonWidth + buttonGap))
        .y(200) // 将按钮放在数字下方
        .r(buttonWidth / 2) // 圆形按钮
        .color(C.white)
        .text("")
        .strokeColor(C.blue)
        .strokeWidth(2)
        .textColor(C.black);
    buttons.push(btn);

    // 用signArray来记录是否在数字之间存在乘号（用1表示存在，0表示不存在）。
    signArray.push(0);

    btn.drag(false); // 禁止按钮拖动
    btn.clickable(true).onClick(() => {
        sd.inter(async () => {
            if (signArray[i] === 1) {
                // 如果当前间隔已经有乘号，点击后移除乘号，并将按钮颜色恢复为白色
                signArray[i] = 0;
                totalMultiplicationSigns--;
                btn.startAnimate().color(C.white).endAnimate();
            } else if (totalMultiplicationSigns < K) {
                // 如果当前间隔没有乘号且还有可用的乘号，点击后插入乘号，并改变按钮颜色以表示此处有乘号
                signArray[i] = 1;
                totalMultiplicationSigns++;
                btn.startAnimate().color(C.green).endAnimate();
            }

            // 实时计算并显示结果
            let expression = digits[0] + "";
            for (let j = 1; j < N; j++) {
                if (signArray[j - 1] === 1) {
                    expression += `*${digits[j]}`;
                } else {
                    expression += digits[j];
                }
            }
            let result = eval(expression); // 实际应用中要更安全地计算表达式
            console.log(expression + " = " + result);

            // 在div下方显示表达式和结果
            if (resultDisplay) {
                resultDisplay.erase(); // 移除上一次的结果
            }
            resultDisplay = new sd.Text(div).text(`表达式: ${expression} = ${result}`).x(5).dy(30); // 结果显示在按钮下方
        }).catch(err => {
            console.error(err);
        });
    });
}
let resultDisplay = null;

sd.main(async () => {});
