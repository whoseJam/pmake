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
const C = sd.color();
const n = 5; // 数码的数量，可自行修改
const k = 2; // 乘号的数量，可自行修改
let usedMultipliers = 0; // 当前已使用的乘号数量
const digits = [];
for (let i = 1; i <= n; i++) {
    const digitText = new sd.Text(svg, `${i}`);
    digitText.x(100 + (i - 1) * 80).y(100);
    digits.push(digitText);
}
const buttons = [];
for (let i = 0; i < n - 1; i++) {
    const button = new sd.Button(div).width(40);
    const cx = (digits[i].cx() + digits[i + 1].cx()) / 2;
    button.cx(cx).cy(digits[0].cy());
    button.text("×");
    button.color(C.BUTTON_GREY);
    buttons.push(button);
}

// 创建结果显示文本
const resultText = new sd.Text(div, "");
resultText.x(100).y(200);

// 存储乘号状态的数组
const multipliers = new Array(n - 1).fill(false);

sd.init(() => {
    buttons.forEach((button, index) => {
        button.onClick(() => {
            sd.inter(async () => {
                if (multipliers[index]) {
                    multipliers[index] = false;
                    usedMultipliers--;
                } else {
                    if (usedMultipliers < k) {
                        multipliers[index] = true;
                        usedMultipliers++;
                    }
                }
                if (!multipliers[index]) {
                    button.color(C.BUTTON_GREY);
                } else {
                    button.color(C.BLUE);
                }
                updateResult();
            });
        });
    });
    updateResult();
});

sd.main(async () => {});

function updateResult() {
    let expression = "";
    for (let i = 0; i < n; i++) {
        expression += digits[i].text();
        if (i < n - 1 && multipliers[i]) {
            expression += "*";
        }
    }
    const result = eval(expression);
    resultText.text(`结果: ${result}`);
}
