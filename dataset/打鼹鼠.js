/*
luogu P2285 打地鼠

1. **初始化阶段**:
- 初始化一个 `sd.Grid` 组件用来表示一个 $n \times n$ 的网格：
例如：`const grid = new sd.Grid(svg).resize(n, n).arrangeGrid();`，并确保它被置于画布中心。

2. **主要动画阶段：**
- 依照输入数据 （每行包括 $\mathit{time}, x, y$），对于每个鼹鼠的出现：
  1. 在时刻 $\mathit{time}$，于网格的单元格 $(x, y)$ 中心位置添加一个代表鼹鼠的 `sd.Circle` 组件，颜色通常为棕色或者易于 辨识的颜色：
   `const mole = new sd.Circle(svg).color(sd.color.brown).center(grid.pos(x, y));`。
  2. 可选：在鼹鼠组件上方或下方添加一个 `sd.Text` 组件来显示鼹鼠出现的时刻：
   `new sd.Text(svg).text(time.toString()).center(grid.pos(x, y)).dy(15)` (这里 `dy(15)` 表示将文本向下偏移15个单位，因此文本将显示在鼹鼠圆形的下方)。

3. **交互式设计：**
    - 本题目主要关注的是鼹鼠的出现，因此直接忽略了机器人位置的选择和移动。但整体动画展示过程中，如果允许用户通过不同按钮 重播动画，可以设计一个重播按钮，由于 `sd` 框架已经内置了“播放”、“暂停”、“重播”等按钮，此处可以不必过多考虑。

4. **布局设计：**
   - `sd.Grid` 组件应该被中心对齐，单元格大小应足够大，以便于清楚看到每个鼹鼠的位置。
   - 保持鼹鼠及其相关文本框的美观排列，确保整体布局不拥挤，易于观察。
*/

/*
评价：
sd.Grid 不太会用。
逻辑上没有问题。
*/

import * as sd from "@/sd";

// 输入样例数据
const n = 2;
const m = 2;
const moleData = [
    { time: 1, x: 1, y: 1 },
    { time: 2, x: 2, y: 2 },
];

const svg = sd.svg();
const C = sd.color();

// 初始化一个 n x n 的网格
const grid = new sd.Grid(svg).n(n).m(n);

// 定义一个2D数组来存储鼹鼠出现时的circle对象，如果不需要跟踪circle对象，那该2D数组不是必须的，这里我们仅为了展示。
const moles = new Array(m).fill(null).map(() => {
    return {
        mole: null,
        text: null,
    };
});

sd.main(async () => {
    for (let i = 0; i < m; i++) {
        const { time, x, y } = moleData[i];

        // 由于围棋数组网格坐标从0开始，假设题目的输入是从1开始的，需要将输入的数据(x,y)都减1。
        const cellX = x - 1;
        const cellY = y - 1;
        const gridPos = grid.element(cellX, cellY).center(); // 获取网格 (cellX,cellY) 的位置

        await sd.pause(); // 等待到鼹鼠出现的时间，时间单位是200帧，这里用时间乘以200来代表每次暂停。这样它在time时刻才执行。

        // 在(x,y)位置添加一个代表鼹鼠的sd.Circle组件，颜色通常为棕色
        const mole = new sd.Circle(svg).color(C.brown).center(gridPos).r(10);

        // 在鼹鼠组件上方添加一个文本组件来显示鼹鼠出现的时刻
        const text = new sd.Text(svg).text(`time: ${time}`).center(gridPos).dy(-20);

        // 将鼹鼠的Circle组件及Text组件保存到数组中
        moles[i] = { mole, text };

        // 下面可以添加一个行进来显示机器人的逻辑，不过该题并没有明确提及如何动态模拟机器人的移动，所以此处只做到鼹鼠出现这一步
    }
});
