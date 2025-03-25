/*

luogu P3895

### 动画主题与场景布局
1. **主题**：以“兔子觅食决策可视化”为主题，通过网格交互展示兔子在不同天数的觅食安排，并根据大灰狼捕食情况判断方案是否合法。
2. **布局**：
    - 画面分为两个主要区域：上方为交互网格区，下方为结果显示区。
    - 交互网格区：根据输入的 $n$ 和 $m$ 创建一个 $m$ 行 $n$ 列的网格。每行代表一天，每列代表一只兔子。网格中的每个单元格可以通过点击进行状态切换（选中或未选中），选中状态表示该兔子在当天出去觅食。单元格颜色根据兔子是否会在当天被捕食而有所不同，被捕食的兔子对应的单元格颜色为红色（表示危险），未被捕食的为绿色（表示安全）。
    - 结果显示区：用于展示当前选择方案的生疏度以及是否为合法方案。如果方案不合法，显示具体的不合法原因（如“有兔子在当天会被捕食”或“生疏度超过限制”）。
3. **生疏度**：第 i 天的生疏度被定义为第 i 天出去觅食的兔子个数但第 i-1 天没有出去觅食的兔子个数。

### 二、动画交互设计
1. **单元格点击交互**：用户可以点击网格中的任意单元格，改变其选中状态。点击后，单元格颜色变为黄色（表示被选中，即该兔子当天出去觅食），再次点击则恢复原色。
2. **提交按钮**：用户完成选择后，点击“提交”按钮，系统会根据用户的选择计算生疏度并检查方案是否合法，然后在结果显示区展示相应信息。
3. **重置按钮**：点击“重置”按钮，网格中的所有单元格恢复到初始状态（未选中）。

### 三、动画流程
1. **初始化阶段**：
    - 根据输入的 $n$ 和 $m$ 数据，使用 SD 动画框架创建一个 $m$ 行 $n$ 列的网格布局。
    - 遍历输入的 $n$ 行 $01$ 串数据，为每个单元格设置颜色。如果第 $i$ 行第 $j$ 个字符为 $0$（表示狼在第 $j$ 天会捕食编号为 $i$ 的兔子），则对应的单元格颜色设置为红色；否则设置为绿色。
    - 在结果显示区初始化显示“请进行选择并提交”。
2. **用户交互阶段**：
    - 用户通过点击单元格进行兔子觅食方案的选择，每次点击单元格时，使用 SD 动画框架的事件监听机制捕获点击事件，改变单元格的颜色和选中状态。
    - 当某个兔子在第 i 天的觅食与否状态改变后，实时更新第 i 天和第 i+1 天的生疏度。
    - 第 i 天的生疏度可以用一个 sd.Text 写在网格第 i 行的旁边。

*/

/*
动画逻辑正确，计算逻辑正确。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const n = 5,
    m = 4,
    k = 3,
    l = 1;
const wolfData = ["1001", "1101", "1111", "1110", "0111"];

// 初始化一个二维数组来存储狼的捕食情况
const wolfMatrix = wolfData.map(row => row.split("").map(char => char === "1"));

// 初始化一个二维数组来存储兔子每天是否出去觅食
let rabbitMatrix = Array.from({ length: m }, () => Array(n).fill(false));

// 初始化一个二维数组来存储网格中的矩形对象
const grid = new sd.Grid(svg)
    .n(m)
    .m(n)
    .forEachElement((element, i, j) => {
        // i 是行索引代表几天， j 是列索引代表第几只兔子
        if (!wolfMatrix[j][i]) {
            // 狼在第 i 天会捕食编号为 j+1 的兔子。
            element.fill(C.red);
        } else {
            element.fill(C.green);
        }
        element.onClick(() => {
            if (wolfMatrix[j][i]) {
                if (rabbitMatrix[i][j]) {
                    rabbitMatrix[i][j] = false;
                    element.fill(C.green);
                } else {
                    rabbitMatrix[i][j] = true;
                    element.fill(C.yellow);
                }
                updateResult();
            }
        });
    });

// 生疏度计算函数
function calculateP(i) {
    if (i === 0) return 0;
    let count = 0;
    for (let j = 0; j < n; j++) {
        if (rabbitMatrix[i][j] && !rabbitMatrix[i - 1][j]) {
            count++;
        }
    }
    return count;
}

// 验证方案是否合法
function validate() {
    for (let i = 0; i < m; i++) {
        let dayCount = 0;
        for (let j = 0; j < n; j++) {
            if (rabbitMatrix[i][j]) {
                dayCount++;
                if (!wolfMatrix[j][i]) {
                    return `第 ${i + 1} 天，兔子 ${j + 1} 会被捕食，方案不合法。`;
                }
            }
        }
        if (dayCount !== k) {
            return `第 ${i + 1} 天，只有 ${dayCount} 只兔子出去觅食，需要 ${k} 只兔子，方案不合法。`;
        }
        let p_value = calculateP(i);
        if (p_value > l) {
            return `第 ${i + 1} 天的生疏度 ${p_value} 超过了限制 ${l}，方案不合法。`;
        }
    }
    return "方案合法。";
}

// 更新结果显示区
const resultText = new sd.Text(div).text("请进行选择并提交").x(0).y(200);
const submitButton = new sd.Button(div).text("提交").x(0).y(250);
submitButton.onClick(() => {
    const result = validate();
    resultText.text(result);
});

// 生疏度显示
const pTexts = Array.from({ length: m }, (_, i) =>
    new sd.Text(svg)
        .text(`第 ${i + 1} 天生疏度: 0`)
        .x(n * 50 + 20)
        .y(i * 50 + 25)
);

function updateResult() {
    for (let i = 0; i < m; i++) {
        pTexts[i].text(`第 ${i + 1} 天生疏度: ${calculateP(i)}`);
    }
}

sd.main(async () => {
    // 主逻辑，这里可以添加一些初始动画效果
    await sd.pause();
});
