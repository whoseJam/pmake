/*
luogu P1018

### 需求描述
实现一个包含数码、间隔、乘号插入及实时计算功能的交互场景。具体要求如下：
1. **数码与间隔结构**：存在 `n` 个数码，这些数码中间有 `n - 1` 个间隔，每个间隔都具备插入乘号的功能。
2. **乘号使用限制**：总共只有 `k` 个乘号可供使用，即所有间隔中同时最多只能放置 `k` 个乘号。
3. **按钮交互逻辑**：提供 `n - 1` 个按钮，每个按钮对应一个间隔。每次点击按钮，该按钮对应的间隔会在插入乘号和取消乘号之间进行切换。例如，首次点击按钮，会在对应的间隔插入乘号；再次点击同一个按钮，则会取消该间隔的乘号。
4. **实时计算功能**：每当按钮点击操作导致乘号的放置情况发生变化时，需要实时更新并计算插入乘号后的表达式的结果。    

 */

/*
评价：
没有计算逻辑错误，有动画逻辑错误。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

const N = 4; // 数字串长度
const K = 2; // 乘号数量
const digits = "1231"; // 数字串

const multiply_signs_status = new Array(N - 1).fill(false);
let placed_signs_count = 0;
const C = sd.color();

// 创建数字数组，并使其初始状态透明
const digitsArray = new sd.Array(svg).resize(N).forEachElement((digit, i) => {
    digit.value(digits[i]);
});

// 创建乘号按钮数组，并使其初始状态透明
const multiplyButtons = new sd.ValueArray(div);
for (let i = 1; i < N; i++) {
    multiplyButtons.push(
        new sd.Button(multiplyButtons).text("Insert x").onClick(() => {
            handleButtonClick(i - 1);
        })
    );
}

// 创建结果输出的文本组件并使其初始透明状态
const resultText = new sd.Text(div).text("Result: ").dy(50);

// 处理按钮点击的函数定义
function handleButtonClick(i) {
    sd.inter(async () => {
        if (multiply_signs_status[i]) {
            multiply_signs_status[i] = false;
            placed_signs_count--;
            multiplyButtons.element(i).text("Insert x");
        } else if (placed_signs_count < K) {
            multiply_signs_status[i] = true;
            placed_signs_count++;
            multiplyButtons.element(i).text("Remove x");
        }
        await updateExpression();
        placeMultiplySigns(); // 更新乘号位置
        if (placed_signs_count != K) {
            resultText.text(`Result: Waiting for all signs to be placed (${placed_signs_count} out of ${K})`);
        }
    });
}

// 更新表达式并计算结果的函数定义
async function updateExpression() {
    if (placed_signs_count != K) return; // 仅当恰好放入K个乘号才计算

    let segments = [digits[0]];
    for (let i = 0; i < N - 1; i++) {
        if (multiply_signs_status[i]) {
            segments.push("*");
            segments.push(digits[i + 1]);
        } else {
            segments[segments.length - 1] += digits[i + 1];
        }
    }

    // 将分割表达式片段分解为数字数组：
    let segmentsArray = [];
    let segment = "";
    for (let char of segments.join("")) {
        if (char === "*") {
            if (segment) {
                segmentsArray.push(BigInt(segment));
                segment = "";
            }
        } else {
            segment += char;
        }
    }
    if (segment) {
        segmentsArray.push(BigInt(segment));
    }

    // 计算乘积结果
    let product = segmentsArray.reduce((acc, curr) => acc * curr, BigInt(1)); // 计算结果应为 BigInt
    resultText.text(`Result: ${product}`);
}

// 创建乘号图形放置在两个数字之间
const multiplySigns = new sd.ValueArray(svg, N - 1);
for (let i = 1; i < N; i++) {
    multiplySigns.push(new sd.Mathjax(multiplySigns, "\\times"));
    multiplySigns.lastElement().opacity(0);
}

function placeMultiplySigns() {
    multiplySigns.forEachElement((sign, i) => {
        if (multiply_signs_status[i]) {
            sign.startAnimate().opacity(1).endAnimate();
        } else {
            sign.startAnimate().opacity(0).endAnimate();
        }
    });
}

sd.main(async () => {
    digitsArray.center(600, 300);
    multiplySigns.cx(digitsArray.cx()).my(digitsArray.y());
    multiplyButtons.forEachElement((button, i) => {
        const midPointX = (digitsArray.element(i).cx() + digitsArray.element(i + 1).cx()) / 2;
        const midPointY = digitsArray.element(i).cy() + 50;
        button.center(midPointX, midPointY);
    });
    resultText.cx(sd.cx);
});
