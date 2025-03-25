/*

luogu P1174

## 需求文档：P1174 打砖块

### 1. 初始化阶段
- 创建一个画布，用来显示砖块的排列。
  - 使用 `sd.svg()` 创建主要的 SVG 画布。
- 在画布上按题目要求排列出砖块的行列布局。
  - 使用 `sd.Grid` 组件来代表整个砖块矩阵。
  - 每个砖块可以使用 `sd.Box` 组件表示，并填写相应的得分和 “Y/N” 标记。
- 砖块颜色可以按如下方式表示：
  - 打碎的砖块颜色变淡或透明度增高。
  - “N” 砖块用一个颜色（如蓝色）， “Y” 砖块用另一个颜色（如绿色）标记。
- 初始化一个“子弹数量”指示器。
  - 在画布的右下角放置一个文本组件 `sd.Text`，用来显示出当前的子弹数量，初始值为 `k`。

### 2. 主要动画阶段
1. 模拟每次子弹发射的过程。
   1. 接着，模拟子弹从画布底部射向某一列最底部的砖块，若该砖块为“Y”砖块，则自动将上面的砖块一同打碎，直到遇到一个“N”砖块 为止，打碎的是“N”砖块并消耗一个子弹。
   2. 在子弹击中砖块后，被击中的砖块得分累加到总得分，总得分在画布的上方或下方通过一个 `sd.Text` 显示。
   3. 打碎“Y”砖块并不消耗子弹，而打碎“N”砖块则消耗一个子弹，同时更新子弹数量显示。

2. 动态规划模拟过程：
   1. 每打一个“N”砖块，更新动态规划状态，并显示当前状态下的总得分。
   2. 直到没有子弹或者所有砖块被击碎，游戏结束并显示最大得分。

### 3. 交互式设计
由于该题目要求计算最大得分，通常这是一个纯计算过程，没有用户交互部分，但我们可以设计一个模拟操作界面以增加可视化体验：   
1. 每一列底部可以设计一个“发射”按钮，由 `sd.Button` 组件表示，点击该按钮表示向该列发射一颗子弹并触发动画效果。当点击某一 列的“发射”按钮后，该列最底部的未碎砖块会被击中，按照上述规则处理。
2. 用户通过点击按钮来模拟打碎砖块的过程，每次单击按钮后，如果还有子弹，再显示下一次的列选择按钮。如果没有子弹或所有砖块已打碎，计算并显示最终得分。

### 4. 布局设计
1. **画布布局：** 画布主要分为三个部分：上方的总得分显示区、中间的砖块矩阵区和下方的子弹数量显示区。
2. **砖块矩阵：** 以有序的网格形式展示，每砖块上显示得分以及一个颜色。   
3. **得分显示：** 总得分显示在画布顶部或底部中央位置。
4. **子弹数量显示：** 子弹数量指示器显示在画布底部。

## 组件需求列表：
1. `sd.svg()`：主画布。
2. `sd.Grid`：管理砖块矩阵布局。
3. `sd.Box`：表示单个砖块，包含得分和“Y/N”标记。
4. `sd.Text`：用于显示当前总得分和剩余子弹数。
5. `sd.Button`：实现用户交互，每一列底部使用一个按钮来模拟子弹发射。

通过上述设计，动画可直观地展示打砖块的过程，并计算并展示最大得分的动态规划运算过程。

*/

/*
评价：
有逻辑错误，没有太大动画错误。
不太会用 sd.Grid。
*/
import * as sd from "@/sd";

const C = sd.color();
const svg = sd.svg();
const div = sd.div();

const n = 3,
    m = 4,
    k = 2;
const matrix = [
    [
        { f: 9, c: "N" },
        { f: 5, c: "N" },
        { f: 1, c: "N" },
        { f: 8, c: "N" },
    ],
    [
        { f: 5, c: "N" },
        { f: 5, c: "Y" },
        { f: 5, c: "N" },
        { f: 5, c: "N" },
    ],
    [
        { f: 6, c: "N" },
        { f: 2, c: "N" },
        { f: 4, c: "N" },
        { f: 3, c: "N" },
    ],
];

let totalScore = 0;
let bullets = k;

const grid = new sd.Grid(svg)
    .width(600)
    .height(300) // 画布高度调整，以便在下方显示按钮和文本
    .elementWidth(100)
    .elementHeight(80);

let bricks = [];
for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
        const brickInfo = matrix[i][j];
        const brick = new sd.Box(grid).color(brickInfo.c === "Y" ? C.green : C.blue);
        const text = new sd.Text(brick).text(`${brickInfo.f} ${brickInfo.c}`).color(C.white);
        brick.value(text);
        bricks.push({ box: brick, f: brickInfo.f, c: brickInfo.c, hit: false });
        grid.insert(i, j, brick);
    }
}

const totalScoreText = new sd.Text(div).text(`Total Score: ${totalScore}`).x(0).y(300);
const bulletsText = new sd.Text(div).text(`Bullets: ${bullets}`).x(0).y(330);

const shootButtons = [];
for (let i = 0; i < m; i++) {
    shootButtons[i] = new sd.Button(div)
        .text(`Shoot column ${i + 1}`)
        .x(100)
        .y(350 + i * 30);
    shootButtons[i].onClick(() => {
        sd.inter(async () => {
            if (bullets <= 0) {
                alert("No bullets remain!");
                return;
            }

            let col = i;
            let row = n - 1;
            while (row >= 0 && bricks[row * m + col].hit) {
                row--;
            }
            if (row < 0) {
                alert("No bricks left in this column!");
                return;
            }

            let bulletUsed = false;
            while (row >= 0) {
                const brick = bricks[row * m + col];
                brick.hit = true;
                totalScore += brick.f;

                totalScoreText.text(`Total Score: ${totalScore}`);
                await brick.box.startAnimate().opacity(0.3).endAnimate();

                if (brick.c === "Y") {
                    row--; // 若为Y，继续向上查找
                } else {
                    if (!bulletUsed) {
                        bullets--;
                        bulletsText.text(`Bullets: ${bullets}`);
                        bulletUsed = true;
                    }
                    break;
                }
            }
            if (bullets <= 0) {
                alert("Game Over! Total score is: " + totalScore);
            }
        });
    });
}

sd.main(async () => {});
