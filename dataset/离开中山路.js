/*
luogu P1746

## SD 动画框架需求文档：离开中山路

### 1. 初始化阶段：
1. **画布设置**：
    - 使用 `sd.svg` 创建 SVG 画布。
2. **地图表示**：
    - 使用 `sd.Grid` 组件创建 `n×n` 的网格地图，其中：
        - 如果地图值为 `0`，表示“马路”，使用白色单元格（填充颜色为白色）的 `sd.Vertex` 表示。
        - 如果地图值为 `1`，表示“店铺”，使用黑色单元格（填充颜色为黑色）的 `sd.Vertex` 表示。
3. **起始位置和目的地位置标记**：
    - 起始位置 `(x1, y1)` 可以使用一个绿色的 `sd.Circle` 表示，表示“爱与愁大神”的初始位置。
    - 目的位置 `(x2, y2)` 可以使用一个红色的 `sd.Circle` 也表示出来。

### 2. 主要动画阶段：
1. **广度优先搜索(BFS)过程动画表示**：
    - 运行 BFS 算法来寻找从 `(x1, y1)` 到 `(x2, y2)` 的最短路径。在每次更新当前位置时，将表示“爱与愁大神”的 `sd.Circle` 组件从其当前单元格移动至下一个单元格。
    - 每一步移动通过动画展示，例如使用 `sd.moveTo` 来将代表“爱与愁大神”的组件从 `(x, y)` 平滑移动到 `(x', y')`。
    - 到达目的地后，应该显示此行进的步数（即最短路径长度）。
2. **步数显示**：
    - 使用一个 `sd.Text` 组件来动态显示当前行进步数。

### 3. 交互式设计：
1. 题目并没有特别要求交互元素，因此本部分通常可以省略。如果有允许用户交互的需求，可在文档中描述如何交互：
    - 用户重新定义起点和终点。
    - 用户重新输入地图。

### 4. 布局设计：
1. 确保画布大小适应地图大小，方便观看。
2. 各单元格均匀分布，保证视觉效果的整齐。
3. 文本提示放置在合适的位置，如画布顶部或底部，以便展示当前步数或状态信息。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Map example data provided in the problem description.
const n = 3;
const map = [
    [0, 0, 1],
    [1, 0, 1],
    [1, 0, 0],
];
const x1 = 1,
    y1 = 1,
    x2 = 3,
    y2 = 3;
const sx = x1 - 1,
    sy = y1 - 1,
    ex = x2 - 1,
    ey = y2 - 1; // 1-based to 0-based.

const gridSize = 50; // Assume each grid cell is 50 units in size.

sd.main(async () => {
    const grid = new sd.Grid(svg)
        .width(n * gridSize)
        .height(n * gridSize)
        .elementWidth(gridSize)
        .elementHeight(gridSize)
        .n(n)
        .m(n)
        .center(250, 250);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = grid.element(i, j);
            if (map[i][j] === 1) cell.color(C.black);
        }
    }

    // 起始位置标记为"S"，使用绿色背景。
    const startCell = grid.element(sx, sy);
    const start = new sd.Circle(startCell)
        .r(gridSize / 2 - 2)
        .color(C.green)
        .center(startCell.center());
    const startText = new sd.Text(startCell, "S").color(C.white).center(startCell.center());

    // 目的地位置标记为"E"，使用红色背景。
    const endCell = grid.element(ex, ey);
    const end = new sd.Circle(endCell)
        .r(gridSize / 2 - 2)
        .color(C.red)
        .center(endCell.center());
    const endText = new sd.Text(endCell, "E").color(C.white).center(endCell.center());

    await sd.pause();

    async function bfs() {
        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        const queue = [{ x: sx, y: sy, step: 0 }];
        const visited = [];
        for (let i = 0; i < n; i++) {
            visited[i] = new Array(n).fill(false);
        }
        visited[sx][sy] = true;
        const parent = [];
        for (let i = 0; i < n; i++) {
            parent[i] = new Array(n).fill(null);
        }

        let currentStepLabel = new sd.Text(svg, "Step: 0").x(10).y(10);
        const currentPosMarker = new sd.Circle(svg).r(10).color(C.blue);
        currentPosMarker.center(grid.element(sx, sy).center());

        while (queue.length > 0) {
            const { x, y, step } = queue.shift();
            currentStepLabel.text(`Step: ${step}`);
            grid.value(x, y, step);
            currentPosMarker.center(grid.element(x, y).center());

            if (x === ex && y === ey) {
                // 如果到达终点，显示最短路径步数。
                let trace = [];
                let [px, py] = [x, y];
                while (parent[px][py] !== null) {
                    trace.push([px, py]);
                    [px, py] = parent[px][py];
                }
                trace.push([sx, sy]);
                trace.reverse();

                let prev = [sx, sy];
                for (let i = 1; i < trace.length; i++) {
                    const [nx, ny] = trace[i];
                    const prevCell = grid.element(prev[0], prev[1]);
                    const nextCell = grid.element(nx, ny);
                    currentPosMarker.attachTo(nextCell.layer());
                    currentPosMarker.center(nextCell.center());
                    prev = [nx, ny];
                    await sd.pause();
                }

                console.log(`Shortest path distance: ${step}`);
                new sd.Text(svg, `Shortest path distance: ${step}`).x(10).y(30);
                break;
            }

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < n && ny >= 0 && ny < n && map[nx][ny] === 0 && !visited[nx][ny]) {
                    queue.push({ x: nx, y: ny, step: step + 1 });
                    visited[nx][ny] = true;
                    parent[nx][ny] = [x, y];

                    const visitedCell = grid.element(nx, ny);
                    visitedCell.color(C.lightGrey);
                    await sd.pause();
                }
            }
        }

        if (!found) {
            console.log("No path found!");
        }
    }

    bfs();
});
