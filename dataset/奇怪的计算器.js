/*

luogu P4041

### 需求描述

#### 功能描述
1. **输入与初始化**：
    - 开发一个基于 SD 动画框架的计算器程序。该计算器接收两个主要输入：一个正整数 `X` 作为初始值，以及一个包含 `n` 条指令的数组（使用 `sd.Array` 存放）。这里的 `n` 为正整数，指令数组中的每一条指令都是以下四种类型之一（`a` 为正整数）：
        - `+a`：将当前计算结果加上 `a`。
        - `-a`：将当前计算结果减去 `a`。
        - `*a`：将当前计算结果乘以 `a`。
        - `@a`：将当前计算结果加上 `a * X`（`X` 为初始输入的正整数）。
2. **运算过程**：
    - 计算器从初始值 `X` 开始，按照指令数组中指令的顺序依次执行每一条指令。每次执行完一条指令后，需要检查计算结果是否溢出。
3. **溢出处理**：
    - 计算结果的存储范围限定在 `L` 到 `R` 之间（包含 `L` 和 `R`）的正整数。这里使用 `sd.Line` 构造 `L` 和 `R` 的上下边界。
    - 如果某次指令执行后，计算结果超过了 `R`，计算器应自动将结果调整为 `R`，然后以 `R` 作为当前结果继续后续的计算。
    - 同理，如果计算结果小于 `L`，计算器应将结果调整为 `L`，再接着进行后续的计算。
4. **结果返回与轨迹绘制**：
    - 完成所有 `n` 条指令的计算后，返回最终的计算结果。
    - 使用 `sd.Path` 结合 `sd.PathPen` 来绘制变量在经过这些运算后的轨迹。轨迹应清晰展示变量在每一步运算后的取值变化情况，并且要考虑到溢出处理对轨迹的影响。

#### 代码实现要求
1. **指令数组存储**：
    - 必须使用 `sd.Array` 来存放 `n` 条指令。指令数组的元素类型应为字符串，格式如上述描述的四种指令形式。
2. **边界构造**：
    - 使用 `sd.Line` 正确构造 `L` 和 `R` 的上下边界。`sd.Line` 的使用应符合 SD 动画框架的官方文档要求，确保边界的有效性和正确性。
3. **轨迹绘制**：
    - 利用 `sd.Path` 和 `sd.PathPen` 绘制变量的运算轨迹。绘制过程应遵循 SD 动画框架的规范，轨迹应能够直观地反映变量在每一步运算后的变化情况，包括溢出处理后的取值变化。
4. **代码风格**：
    - 编写的代码应严格遵循 example 文件夹下的代码风格要求。代码结构应清晰，逻辑合理，变量命名应具有描述性，便于理解和维护。
5. **文档引用**：
    - 在编写代码时，需仔细查阅官方文档（文档来源：知识库），确保所使用的组件、函数方法真实存在且使用正确。对于涉及到的每个组件，如 `sd.Array`、`sd.Line`、`sd.Path` 和 `sd.PathPen`，要深入查阅其继承链上每个组件的文档，避免遗漏任何函数方法，保证代码的准确性和稳定性。

#### 输出要求
1. **代码输出**：
    - 提供完整的 JS 代码，实现上述描述的计算器功能，包括输入处理、指令执行、溢出处理、结果返回以及轨迹绘制。
2. **代码解释**：
    - 对代码的关键部分进行详细解释，说明每一段代码的作用、使用的 SD 动画框架组件和函数方法的目的，以及如何满足上述功能需求。解释应逻辑清晰、表达准确，便于提问者理解代码的实现思路和运行机制。 

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();

// 定义输入与初始化部分
const initialValueX = 5; // 初始值 X
const minValue = 1;
const maxValue = 10;
const instructions = new sd.Array(svg).x(100).y(50); // 使用 sd.Array 存放指令数组
instructions.start(1);
instructions.push("+3").push("*2").push("@1"); // 示例指令数组

// 定义边界
const L = new sd.Line(svg).source(50, 200).target(250, 200); // 下边界
const R = new sd.Line(svg).source(50, 100).target(250, 100); // 上边界
sd.Label(L, "L");
sd.Label(R, "R");

// 轨迹绘制相关
const path = new sd.Path(svg).stroke(C.textBlue).strokeWidth(1.5);
const pen = new sd.PathPen(path);

function getY(result) {
    return (maxValue - result) / (maxValue - minValue) *  (L.y() - R.y()) + R.y();
}

// 计算器核心逻辑
async function calculate() {
    let result = initialValueX;
    pen.MoveTo(instructions.x(), getY(result));
    path.d(pen.toString());
    for (let i = 1; i <= instructions.length(); i++) {
        const element = instructions.element(i);
        const instruction = element.text();
        const num = parseInt(instruction.slice(1));
        switch (instruction[0]) {
            case "+":
                result += num;
                break;
            case "-":
                result -= num;
                break;
            case "*":
                result *= num;
                break;
            case "@":
                result += num * initialValueX;
                break;
        }
        // 溢出处理
        if (result > maxValue) {
            result = maxValue;
        } else if (result < minValue) {
            result = minValue;
        }
        await sd.pause();
        pen.LinkTo(element.mx(), getY(result));
        path.startAnimate().d(pen.toString()).endAnimate();
    }
    return result;
}

sd.init(() => {
    L.cx(instructions.cx());
    R.cx(instructions.cx());
});

sd.main(async () => {
    await calculate();
});
