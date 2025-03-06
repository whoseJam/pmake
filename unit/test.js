import * as sd from "@/sd";

// 定义数码数量n和乘号数量k
const n = 5;
const k = 2;
// 创建一个svg用于容纳数码和显示结果
const svg = sd.svg();
// 用于存储数码的数组
const digits = [];
// 用于存储按钮的数组
const buttons = [];
// 用于存储当前乘号放置情况的数组，初始都为false
const multipliers = new Array(n - 1).fill(false);
// 用于显示结果的文本元素
const resultText = new sd.Text(svg, "结果: ").x(100).y(100);
const C = sd.color();

// 初始化数码
for (let i = 0; i < n; i++) {
    const digit = new sd.Text(svg, (i + 1).toString()).x(100 + i * 50).y(50);
    digit.color(C.blue);
    digits.push(digit);
}

// 初始化按钮
for (let i = 0; i < n - 1; i++) {
    const button = new sd.Button(svg).x(125 + i * 50).y(75);
    button.text("×");
    button.color(C.green);
    button.onClick(() => {
        multipliers[i] = !multipliers[i];
        updateResult();
    });
    buttons.push(button);
}

// 初始化时更新结果
function updateResult() {
    let expression = digits[0].text();
    for (let i = 0; i < n - 1; i++) {
        if (multipliers[i]) {
            expression += "×";
        }
        expression += digits[i + 1].text();
    }
    let result;
    try {
        result = eval(expression);
    } catch (error) {
        result = "错误";
    }
    resultText.text(`结果: ${result}`);
}

sd.init(() => {});
sd.main(async () => {
    await sd.pause();
});
