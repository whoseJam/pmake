/*

luogu P1174

### 需求描述
实现打砖块游戏，游戏界面中，砖块按列从上至下依次排列，各列砖块数量随机生成，数量范围可自定义，以此形成每列砖块数量均不相同的布局。

你可以用 sd.Grid 来实现砖块的布局。

在每列砖块的最底部，对应设置一个按钮。玩家点击按钮后，该列最下方的砖块将被消除；若该列已无砖块，则点击按钮操作无效。

你可以用 sd.Button 去实现按钮。

游戏设定玩家总共拥有 K 次点击按钮的机会。部分砖块被设定为特殊方块，当特殊方块被消除时，玩家将额外获得一次点击按钮的机会，使得游戏过程更具策略性和趣味性。

每个砖块都被赋予独一无二的得分值，得分值的设定可以遵循一定规则，也可随机生成，以增加游戏的丰富性。通过这样的设计。  

得分写在砖块上，且普通方块为绿色，特殊方块为黄色。

*/
import * as sd from "@/sd";

// 游戏参数设置
const brickCount = 3;
const totalClicks = 5;
const specialBrickRatio = 0.3;
const columnCount = 5;
let clickCount = totalClicks;
let score = 0;
const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).axis("col").elementWidth(70);
const clickCountText = new sd.Text(svg, `剩余点击次数: ${clickCount}`);
const scoreText = new sd.Text(svg, `当前得分: ${score}`);

// 处理按钮点击事件
function handleButtonClick(col) {
    if (clickCount > 0 && grid.endM(col) >= grid.startM()) {
        clickCount--;
        const brick = grid.element(col, grid.endM(col));
        const isSpecial = brick.color().fill === C.yellow;
        score += brick.intValue();
        grid.startAnimate().erase(col, grid.endM(col)).endAnimate();
        if (isSpecial) {
            clickCount++;
        }
        clickCountText.text(`剩余点击次数: ${clickCount}`);
        scoreText.text(`当前得分: ${score}`);
    }
}

// 初始化游戏
sd.init(() => {
    grid.x(100).y(100);
    clickCountText.x(100).y(50);
    scoreText.x(100).y(70);
    // 创建砖块和按钮
    for (let col = 0; col < columnCount; col++) {
        for (let row = 0; row < brickCount; row++) {
            const isSpecial = Math.random() < specialBrickRatio;
            grid.insert(col, row, sd.rand(1, 100));
            if (isSpecial) {
                grid.color(col, row, C.yellow);
            } else {
                grid.color(col, row, C.green);
            }
        }
        const button = new sd.Button(svg);
        button.text("消除");
        button.onClick(() => {
            sd.inter(async () => {
                handleButtonClick(col);
            });
        });
        button.cx(grid.element(col, brickCount - 1).cx()).y(grid.my() + 20);
    }
});

sd.main(async () => {});
