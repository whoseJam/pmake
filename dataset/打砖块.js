/*

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

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const R = sd.rule();

// 全局变量
const K = 5; // 总共能点击按钮的次数
let clicksLeft = K; // 剩余点击次数
const columns = 5; // 列数
const minBricksPerColumn = 1;
const maxBricksPerColumn = 8; // 每列最多的砖块数

// 存储每列的砖块数组
const columnsBricks = [];
// 存储每列的按钮
const columnsButtons = [];

sd.init(() => {
    // 初始化每列的砖块数组
    for (let i = 0; i < columns; i++) {
        columnsBricks.push([]);
    }

    // 生成砖块和按钮
    for (let col = 0; col < columns; col++) {
        const bricksInColumn = Math.floor(Math.random() * (maxBricksPerColumn - minBricksPerColumn + 1)) + minBricksPerColumn;
        for (let row = 0; row < bricksInColumn; row++) {
            const brick = new sd.Rect(svg);
            brick.x(col * 50 + 25).y(row * 20 + 20);
            brick.width(40).height(15);
            brick.score = Math.floor(Math.random() * 100); // 每个方块有不同得分
            brick.isSpecial = Math.random() < 0.2; // 20% 的特殊方块
            if (brick.isSpecial) {
                brick.fill(C.YELLOW);
            } else {
                brick.fill(C.GREEN);
            }
            const scoreText = new sd.Text(brick, brick.score.toString()).x(brick.mx() - 10).y(brick.my() + 5);
            columnsBricks[col].push(brick);
        }

        // 在每列下方添加按钮
        const button = new sd.Button(svg);
        button.x(col * 50 + 25).y(bricksInColumn * 20 + 30);
        button.width(40).height(15);
        button.text("点击");
        columnsButtons.push(button);
        button.onClick(() => {
            sd.inter(async () => {
                if (clicksLeft > 0) {
                    const bricks = columnsBricks[col];
                    if (bricks.length > 0) {
                        const lastBrick = bricks.pop();
                        lastBrick.startAnimate().opacity(0).endAnimate().remove();
                        clicksLeft--;
                        if (lastBrick.isSpecial) {
                            clicksLeft++;
                        }
                    }
                }
            });
        });
    }
});

sd.main(async () => {});
