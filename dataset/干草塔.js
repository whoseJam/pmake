/*

luogu P4954

# 需求文档：干草塔动画设计

## 1. 初始化阶段

1. **场景设置：** 创建一个场景，其中包含一个传送带，用 `sd.Rect` 表示，颜色为 `C.grey`。传送带位于画布的上方，宽为所有干草包宽度之和，高为1。

2. **干草包初始化：** 对于输入的干草包序列，每个干草包用一个宽度为 `W_i`、高度为1的 `sd.Rect` 表示，颜色为 `C.chocolate`，并按照输入的顺序排列在传送带上。使用左对齐的 `sd.ValueStack` 来管理这些干草包序列。

3. **干草塔初始化：** 在传送带下方留出一块区域用作干草塔的堆叠区域，初始时为空。

4. **交互按钮：** 创建两个交互按钮：
    - **新建一层：** 用一个 `sd.Button` 表示，用于控制是否开启新的一层。
    - **放置：** 同样用一个 `sd.Button` 表示，用于控制将当前干草包放置到当前层。

## 2. 主要动画阶段

1. **干草包在传送带上的移动：** 干草包从传送带左端运送到右端，到达传送带终点后将“掉落”到干草塔的堆叠区。如果用户没有点击“放置”按钮，干草包会暂时停留在传送带终点。

2. **按钮操作：**
   - **新建一层：** 当用户点击“新建一层”按钮时，当前干草包将作为新一层的第一个干草包，并“掉落”到新一层的起始位置。如果当 前层干草包的总宽度大于上一层，且当前层不是最下面一层，用户可能需要先处理当前层干草包的总宽度问题，因此在这里，若当前层干 草包总宽度超过上一层的总宽度，用户点击“新建一层”按钮将提示错误信息。

   - **放置：** 当用户点击“放置”按钮时，当前传送带上的干草包将“掉落”到干草塔当前层的末尾。如果当前层没有干草包（即第一层 ），该干草包将作为第一层的第一个干草包。

3. **干草塔的堆叠规则：** 在干草塔中，每层干草包必须紧密排列，不允许出现缝隙，并且上层干草的宽度不能超过下层的宽度。因此 ：
    - 每次“放置”干草包到当前层时，需要验证当前层总宽度如果加上当前干草包宽度是否超过了传送带上所有干草包总宽度，若超过了 则不能“放置”。
    - 当要新建一层干草包时，要确保当前层干草包总宽度不大于下面一层的总宽度。

4. **动画效果：** 干草包在传送带上移动至终点，如果用户点击“放置”按钮，干草包从传送带“掉落”到当前层，干草包在堆叠时需紧密 排列，并实时更新干草塔的层数。

## 3. 交互式设计

1. **“新建一层”按钮操作：**
   - 如果当前层干草包的总宽度小于等于上一层干草包的总宽度（若当前为第一层，可无条件新建一层），则将当前传送带上的干草包作为新一层的第一个干草包。
   - 如果当前层干草包的总宽度大于上一层干草包的总宽度（且当前层不是最下面一层），用户点击“新建一层”按钮将提示错误信息，提示用户应该先完成当前层干草包堆叠。

2. **“放置”按钮操作：**
   - 如果当前层干草包总宽度加上当前干草包宽度超过了其下面一层干草包的总宽度（除非当前层为最底层），那么不允许将干草包“放 置”到当前层，并提示“新建一层”。
   - 否则，将当前传送带上的干草包“放置”到当前层。

## 4. 布局设计
1. **传送带：** 位于画布上方，由 `sd.Rect` 表示。传送带的长度可以设置为所有干草包宽度之和加一些额外的空间，以免干草包排列过于紧凑。

2. **干草塔：** 位于传送带下方，每层干草包紧密排列，上层干草的宽度不能超过下层的宽度，最底层干草包的总宽度是干草包原始序 列的总宽度。

3. **交互按钮：** 通常位于画布的一角，比如画布右上角或画布左下角。

4. **干草包排列：** 干草包在传送带上的初始排列和干草塔上的堆叠需要精准计算每一个干草包的位置，确保干草包紧密排列。 
*/

/*
评价：
虚构方法：Button.textColor，Array.getElement，Array.setElement。
对如何添加数组理解不够到位。
存在计算逻辑上的小瑕疵。（忘记检查放置当前行的第一个干草包时的可行）
*/

import * as sd from "@/sd";

// Initialize hay bale widths and total count
const W = [5, 1, 3, 1, 2, 3, 3, 1]; // Example input (W = [1, 2, 3])
const n = W.length;
const totalWidth = W.reduce((sum, val) => sum + val, 0);
const scaleFactor = 30; // To make the bales more visible

// Initialize scene canvas
const svg = sd.svg();
const div = sd.div();
const C = sd.color();

// Initialize the conveyor belt
const conveyorBelt = new sd.Rect(svg)
    .width(totalWidth * scaleFactor + 100)
    .height(10)
    .fill(C.grey)
    .x(0)
    .y(-100);

// Initialize hay bales with scaled dimensions
const hayBales = new sd.ValueStack(svg).align("x");
for (let i = 0; i < n; i++) {
    const hayBale = new sd.Rect(hayBales.layer())
        .width(W[i] * scaleFactor)
        .height(scaleFactor)
        .fill(C.chocolate)
        .stroke(C.black)
        .strokeWidth(0.1);
    hayBales.push(hayBale);
}

// Initialize tower variables
let towerLayers = [[]]; // Array to store layers of hay bales
let layerWidths = [0]; // Array to store the total width of each layer (in the original scale, not scaled)
let currentLayerIndex = 0; // Index of the current layer
let currentHayBaleIndex = 0; // Index of the next hay bale on the conveyor belt
let towerBaseX = 400;
let towerBaseY = 0; // Initial y position for the tower base

// Buttons for interaction
const newLayerButton = new sd.Button(div).fill(C.blue).text("New Layer").x(50).y(10);

const placeButton = new sd.Button(div).fill(C.blue).text("Place").x(150).y(10);

newLayerButton.onClick(async () => {
    sd.inter(async () => {
        if (currentHayBaleIndex >= n) {
            console.log("All hay bales have been used.");
            return;
        }

        if (currentLayerIndex === 0 || layerWidths[currentLayerIndex] > 0) {
            if (currentLayerIndex > 0 && layerWidths[currentLayerIndex] > 0) {
                if (layerWidths[currentLayerIndex] > layerWidths[currentLayerIndex - 1]) {
                    console.log("Width of the current layer cannot exceed that of the layer below it. Please finish the current layer first.");
                    return;
                }
            }
            currentLayerIndex++;
            towerLayers.push([]);
            layerWidths.push(0);
        }

        const currentHayBale = hayBales.element(currentHayBaleIndex);
        towerLayers[currentLayerIndex].push(currentHayBale);
        layerWidths[currentLayerIndex] += W[currentHayBaleIndex] * scaleFactor;

        currentHayBale
            .startAnimate()
            .x(towerBaseX)
            .y(towerBaseY + currentLayerIndex * (scaleFactor + 1))
            .endAnimate();
        currentHayBaleIndex++;
    });
});

placeButton.onClick(async () => {
    sd.inter(async () => {
        if (currentHayBaleIndex >= n) {
            console.log("All hay bales have been used.");
            return;
        }

        const currentHayBale = hayBales.element(currentHayBaleIndex);
        const addedWidth = W[currentHayBaleIndex] * scaleFactor;
        const nextTotalWidth = layerWidths[currentLayerIndex] + addedWidth;

        if (currentLayerIndex === 0) {
            currentHayBale
                .startAnimate()
                .x(towerBaseX + layerWidths[0])
                .y(towerBaseY)
                .endAnimate();
            towerLayers[0].push(currentHayBale);
            layerWidths[0] += addedWidth;
            currentHayBaleIndex++;
        } else {
            if (nextTotalWidth > layerWidths[currentLayerIndex - 1]) {
                console.log("Total width of the current layer cannot exceed that of the layer below it. Create a new layer.");
                return;
            }

            currentHayBale
                .startAnimate()
                .x(towerBaseX + layerWidths[currentLayerIndex])
                .y(towerBaseY + currentLayerIndex * (scaleFactor + 1))
                .endAnimate();
            towerLayers[currentLayerIndex].push(currentHayBale);
            layerWidths[currentLayerIndex] += addedWidth;
            currentHayBaleIndex++;
        }
    });
});

sd.main(async () => {
    await sd.pause();
});

// Show the scene if sd.show() is the correct function to display the scene.
// If not, you need to check how to display the scene properly in the sd-animation-framework.
