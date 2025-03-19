/*
luogu P1868

## 需求文档：饥饿的奶牛

### 1. 初始化阶段

1. **画布初始化：**
   - 使用 `sd.svg` 创建一个 SVG 画布。
   - 画布上应该有一个数轴，表示牧草区间的位置，数轴从最小值到最大值，例如从 $0$ 到 $3 \times 10^6$，但通常题目中会给出一个具体的最大范围，这里假设一个合理的显示范围，例如从 $0$ 到 $10$ 或一个更小的范围，以便于演示。

2. **牧草区间表示：**
   - 使用 `sd.Rect` 组件来表示每个牧草区间，例如区间 $[x, y]$ 可以用一个矩形表示，矩形的左边界为 $x$，右边界为 $y$，高度固定，颜色可以统一为绿色，表示“未选择”的牧草区间。
   - 当用户点击一个牧草区间矩形时，如果该区间未被选择，则将其颜色更改为黄色，表示“已选择”的牧草区间，并确保其 他与当前区间有重叠的区间不能被选择。如果该区间已被选择，则将其颜色恢复为绿色，表示“未选择”的牧草区间。        

3. **显示当前已选择的牧草堆数：**
   - 使用 `sd.Text` 组件在画布上显示当前已选择的牧草堆数总和。

### 2. 主要动画阶段

1. **牧草区间的显示：**
   - 将输入的牧草区间数组 `intervals` 硬编码到画布上，每个区间用一个 `sd.Rect` 表示，并设置其初始颜色为绿色。 
   - 当用户点击一个 `sd.Rect` 时，检查该区间是否与其他已选择的区间有重叠，如果没有重叠，则将该区间颜色更改为黄色，并更新已选择的牧草堆数总和。

2. **更新已选择的牧草堆数总和：**
   - 每次用户点击一个牧草区间并成功选择或取消选择时，重新计算已选择的牧草堆数总和，并更新 `sd.Text` 组件显示的内容。

### 3. 交互式设计

1. **牧草区间的点击交互：**
   - 为每个 `sd.Rect` 添加点击事件处理函数，当用户点击一个牧草区间时，首先检查该区间是否已被选择：
     - 如果已被选择，则取消选择，将颜色恢复为绿色，并重新计算已选择的牧草堆数总和。
     - 如果未被选择，检查该区间是否与已选择的区间有重叠：
       - 如果没有重叠，则选择该区间，将颜色更改为黄色，并重新计算已选择的牧草堆数总和。
       - 如果有重叠，则提示用户该区间与已选择的区间有重叠，不能选择。

2. **显示提示信息：**
   - 如果用户尝试选择一个与已选择区间有重叠的区间，可以使用一个 `sd.Text` 组件在画布上显示提示信息，例如“该区 间与已选择的区间有重叠，不能选择”。

### 4. 布局设计

1. **数轴布局：**
   - 数轴可以用一条 `sd.Line` 表示，并在数轴上标记出一些关键点，例如 $0, 1, 2, 3, \ldots$，直到最大的区间右边 界值。
   - 数轴下方或上方放置牧草区间矩形，每个区间矩形的位置和宽度由区间 $[x, y]$ 决定，高度固定。

2. **牧草区间布局：**
   - 每个牧草区间矩形应该按照其区间 $[x, y]$ 在数轴上的位置进行布局，例如区间 $[1, 3]$ 的矩形应该从数轴上的 $1$ 位置开始，到 $3$ 位置结束。
   - 如果多个区间有重叠，可以在垂直方向上错开显示，以避免完全重叠。

3. **已选择牧草堆数总和显示：**
   - 在画布顶部或底部使用 `sd.Text` 组件显示当前已选择的牧草堆数总和，例如“已选择牧草堆数总和：5”。
*/

/*

评价：稍微修改一下能用。

编造方法：Text.textArchor。

错误使用：
sd.inter：没有用 sd.inter 把交互部分框起来。
sd.color：没有用 C.yellow/C.green，而是直接用 "yello"/"green"。

视觉效果：
布局不太行。

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const EX = sd.exit();

// Hardcoded intervals for demonstration
const intervals = [
    [1, 3],
    [2, 5],
    [4, 7],
    [6, 9],
];
const intervalRects = [];
const selectedIntervals = [];
let totalLength = 0;

// Number line from 0 to 10
const numberLine = new sd.Line(svg)
    .x1(0)
    .y1(50)
    .x2(10 * 50)
    .y2(50)
    .stroke(C.black);
for (let i = 0; i <= 10; i++) {
    new sd.Text(svg)
        .text(i)
        .x(i * 50)
        .y(70);
}

// Text to display total length of selected intervals
const totalLengthText = new sd.Text(svg).text("Total length of selected intervals: 0").x(250).y(20);

sd.main(async () => {
    for (let i = 0; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        const rect = new sd.Rect(svg)
            .x(start * 50)
            .y(30 + i * 30)
            .width((end - start) * 50)
            .height(20)
            .fill(C.green)
            .stroke(C.black)
            .clickable(true)
            .onClick(() => {
                sd.inter(async () => {
                    handleClick(rect, i, start, end);
                });
            });
        intervalRects.push(rect);
    }
});

function handleClick(rect, index, start, end) {
    const interval = intervals[index];
    const isSelected = selectedIntervals.includes(index);

    if (isSelected) {
        // Deselect the interval
        selectedIntervals.splice(selectedIntervals.indexOf(index), 1);
        rect.fill(C.green);
        totalLength -= end - start + 1;
    } else {
        // Check for overlaps with already selected intervals
        let hasOverlap = false;
        for (let i = 0; i < selectedIntervals.length; i++) {
            const [s, e] = intervals[selectedIntervals[i]];
            if (Math.max(start, s) <= Math.min(end, e)) {
                hasOverlap = true;
                break;
            }
        }

        if (!hasOverlap) {
            selectedIntervals.push(index);
            rect.fill(C.yellow);
            totalLength += end - start + 1;
        } else {
            alert("This interval overlaps with a previously selected interval.");
        }
    }

    totalLengthText.text(`Total length of selected intervals: ${totalLength}`);
}
