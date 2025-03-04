/*
帮我实现如下场景：
有n个数码，其中间有n-1个间隔，每个间隔之间可以插入乘号
总共只有k个乘号可以被使用
需要实时更新计算插入乘号后的表达式的结果
你可以用n-1个按钮去分别操作在这n-1个间隔中的乘号放置情况
按钮被点击一次就是放置乘号，再次被点击就是取消放置，以此循环往复
*/

import * as sd from "@/sd";

const digits = [2, 3, 4, 5, 4, 1, 5];
const k = 2;
const svg = sd.svg();
const C = sd.color();
const arr = new sd.ValueArray(svg).elementWidth(100).y(50);
const resultLabel = new sd.Text(svg, "", "tc");
let multiplicationSigns = new Array(digits.length - 1).fill(false);
let result = 0;

function initDisplay() {
    const elements = [];
    digits.forEach((digit, index) => {
        const digitElement = new sd.Text(svg);
        digitElement.text(digit.toString());
        digitElement.color(C.black);
        digitElement.fontSize(20);
        digitElement.x(index * 80);
        arr.push(digitElement);
    });

    for (let i = 0; i < digits.length - 1; i++) {
        const multiplier = new sd.Text(svg, "×");
        const button = new sd.Button(svg);
        button.text("×").width(40);
        button.cx((arr.element(i).cx() + arr.element(i + 1).cx()) / 2);
        button.y(100);
        multiplier.cx(button.cx()).cy(arr.cy()).opacity(0);
        button.onClick(() => {
            sd.inter(async () => {
                multiplicationSigns[i] = !multiplicationSigns[i];
                multiplier.startAnimate();
                if (multiplicationSigns[i]) multiplier.opacity(1);
                else multiplier.opacity(0);
                multiplier.endAnimate();
                resultLabel.startAnimate();
                calculateResult();
                resultLabel.endAnimate();
            });
        });
    }
    resultLabel.y(150).effect("center", () => {
        resultLabel.cx(arr.cx());
    });
    calculateResult();
}

function calculateResult() {
    let expression = digits[0].toString();
    for (let i = 0; i < digits.length - 1; i++) {
        if (multiplicationSigns[i]) expression += `*${digits[i + 1]}`;
        else expression += digits[i + 1];
    }
    try {
        result = eval(expression);
    } catch (error) {
        result = 0;
    }
    resultLabel.text(`结果: ${result}`);
}

sd.init(() => {
    initDisplay();
});

sd.main(() => {});
