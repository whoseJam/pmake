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

import * as sd from "@/sd";
const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const R = sd.rule();

// 获取输入的 n 和 m
const n = 5; // 这里假设输入为 5，可以根据实际情况修改
const m = 3; // 这里假设输入为 3，可以根据实际情况修改

// 输入的 01 串数据
const wolfData = ["01010", "10101", "00110"];

// 创建网格和显示区域
const grid = new sd.Grid(svg).x(100).y(100);

// 存储每行的生疏度显示文本
const unfamiliarityTexts = [];
// 存储每行的选中状态
const selectedStates = Array(m)
    .fill()
    .map(() => Array(n).fill(false));

// 计算生疏度
function calculateUnfamiliarity(row) {
    if (row === 0) return 0;

    let count = 0;
    for (let j = 0; j < n; j++) {
        if (selectedStates[row][j] && !selectedStates[row - 1][j]) {
            count++;
        }
    }
    return count;
}

// 更新生疏度显示
function updateUnfamiliarity(row) {
    const unfamiliarity = calculateUnfamiliarity(row);
    unfamiliarityTexts[row - 1].text(`生疏度: ${unfamiliarity}`);

    // 如果有下一行，也更新下一行的生疏度
    if (row + 1 < m) {
        const nextUnfamiliarity = calculateUnfamiliarity(row + 1);
        unfamiliarityTexts[row].text(`生疏度: ${nextUnfamiliarity}`);
    }
}

sd.init(() => {
    grid.startN(1).startM(1);
    grid.n(m).m(n);

    // 初始化单元格颜色和生疏度显示
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const value = wolfData[i - 1][j - 1];
            grid.value(i, j, value);
        }

        // 为每行创建生疏度显示文本
        if (i > 1) {
            const unfamiliarityText = new sd.Text(svg, "生疏度: 0").x(grid.mx() + 20).cy(grid.y() + (i - 0.5) * grid.elementHeight());
            unfamiliarityTexts.push(unfamiliarityText);
        }
    }

    // 单元格点击事件
    grid.forEachElement((element, i, j) => {
        if (wolfData[i - 1][j - 1] === "0") return;

        element.onClick(() => {
            sd.inter(async () => {
                selectedStates[i - 1][j - 1] = !selectedStates[i - 1][j - 1];

                if (selectedStates[i - 1][j - 1]) {
                    element.startAnimate().color(C.blue).endAnimate();
                } else {
                    element.startAnimate().color(C.white).endAnimate();
                }

                // 更新当前行和下一行的生疏度
                if (i - 1 > 0) updateUnfamiliarity(i - 1);
            });
        });
    });
    sd.Label(grid, "兔子", "tc");
    sd.Label(grid, "天数", "lc");
});

sd.main(async () => {});
