import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const K = 5; // 总共能点击按钮的次数
let clickCount = K; // 当前剩余点击次数

// 定义每列砖块数量
const columnBrickCounts = [3, 5, 4];

// 定义特殊方块的索引（假设这里只是示例，实际可能有更复杂逻辑确定特殊方块）
const specialBrickIndices = [1, 5];

// 定义每个方块的得分
const brickScores = [10, 20, 15, 30, 25, 40, 12, 18, 22];

// 创建每一列的砖块数组
const columns = [];
for (let i = 0; i < columnBrickCounts.length; i++) {
    const column = new sd.Array(svg);
    for (let j = 0; j < columnBrickCounts[i]; j++) {
        const brick = new sd.Rect(svg);
        brick.width(30).height(20);
        brick.x(i * 40).y(j * 25);
        // 给方块添加得分属性
        brick.score = brickScores[i * columnBrickCounts.length + j];
        column.push(brick);
    }
    columns.push(column);
}

// 创建每一列下方的按钮
const buttons = [];
for (let i = 0; i < columns.length; i++) {
    const button = new sd.Button(svg).text("消除本列下方方块");
    button.x(i * 40).y(columns[i].my() + 30);
    buttons.push(button);
}

sd.init(() => {
    for (let i = 0; i < buttons.length; i++) {
        const buttonIndex = i;
        buttons[i].onClick(() => {
            if (clickCount > 0) {
                const column = columns[buttonIndex];
                const lastBrick = column.lastElement();
                if (lastBrick) {
                    clickCount--;
                    const isSpecial = specialBrickIndices.includes(column.indexOf(lastBrick));
                    if (isSpecial) {
                        clickCount++;
                    }
                    column.startAnimate().dropValue(column.indexOf(lastBrick)).endAnimate();
                }
            }
        });
    }
});

sd.main(async () => {});
