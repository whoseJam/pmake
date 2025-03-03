/*
帮我实现如下场景：
有一个打砖块游戏，砖块是从上往下排列的，每一列的砖块数量各不相同
你可以用sd.Grid组件实现这个布局
在每一列的最下方各有一个按钮，点击按钮会消除本列的最下方的方块，如果本列没有方块则无效果，你可以用sd.Button来实现按钮
总共能点击按钮K次，有一些方块是特殊方块，当这样的方块被消除时，能增加一次点击按钮的机会
每个方块都有自己的得分，且各不相同
*/

import * as sd from "@/sd";

class Brick {
    constructor(score, isSpecial = false) {
        this.score = score;
        this.isSpecial = isSpecial;
    }
}
class Column {
    constructor(bricks) {
        this.bricks = bricks;
    }
}

const K = 5;
const columnConfigs = [
    { brickScores: [10, 20, 15], specialIndices: [1] },
    { brickScores: [5, 8], specialIndices: [] },
    { brickScores: [25, 30, 35, 40], specialIndices: [2] },
    { brickScores: [12], specialIndices: [] },
];

const columns = columnConfigs.map(config => {
    const bricks = config.brickScores.map((score, index) => {
        return new Brick(score, config.specialIndices.includes(index));
    });
    return new Column(bricks);
});

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).elementWidth(80).axis("col");
let clickCount = K;
let totalScore = 0;
const scoreLabel = new sd.Label(grid, "", "tc");

function initGame() {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        for (let brickIndex = 0; brickIndex < column.bricks.length; brickIndex++) {
            const brick = column.bricks[brickIndex];
            grid.insert(colIndex, brickIndex, brick.score);
            grid.color(colIndex, brickIndex, brick.isSpecial ? C.yellow : C.green);
        }
    }
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const button = new sd.Button(grid)
            .text("消除")
            .cx(grid.element(colIndex, 0).cx())
            .y(grid.my() + 10);
        const col = colIndex;
        button.onClick(() => {
            sd.inter(async () => {
                if (clickCount > 0) {
                    clickCount--;
                    if (grid.endM(col) >= grid.startM()) {
                        const removedBrick = grid.element(col, grid.endM(col));
                        grid.startAnimate().erase(col, grid.endM(col)).endAnimate();
                        totalScore += removedBrick.intValue();
                        if (removedBrick.fill() === C.yellow) clickCount++;
                        updateScoreDisplay();
                    }
                }
            });
        });
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreLabel.text(`剩余点击次数: ${clickCount}, 总得分: ${totalScore}`);
}

sd.init(() => {
    initGame();
});

sd.main(() => {});
