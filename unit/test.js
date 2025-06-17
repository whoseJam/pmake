import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

let B = [6, 6]; // B 点坐标 (n, m)
let H = [3, 3]; // 马的坐标

const horseControlPositions = (x, y) => {
    return [
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y + 2],
        [x + 1, y - 2],
        [x - 1, y + 2],
        [x - 1, y - 2],
    ];
};

const isInBoard = (x, y, n, m) => x >= 0 && x <= n && y >= 0 && y <= m;

let checkBoard = new Array(B[0] + 1).fill(null).map(() => new Array(B[1] + 1).fill(false));
let dp = new Array(B[0] + 1).fill(null).map(() => new Array(B[1] + 1).fill(0));

// 初始化棋盘和马控制点是否影响棋盘上某个点
checkBoard[H[0]][H[1]] = true;
horseControlPositions(H[0], H[1])
    .concat([[H[0], H[1]]])
    .forEach(([hx, hy]) => {
        if (isInBoard(hx, hy, B[0], B[1])) {
            checkBoard[hx][hy] = true;
        }
    });

// 动态规划解决过河卒问题
dp[0][0] = checkBoard[0][0] ? 0 : 1;
for (let i = 0; i <= B[0]; i++) {
    for (let j = 0; j <= B[1]; j++) {
        if (checkBoard[i][j]) {
            dp[i][j] = 0;
            continue;
        }
        if (i > 0 && !checkBoard[i - 1][j]) {
            dp[i][j] += dp[i - 1][j];
        }
        if (j > 0 && !checkBoard[i][j - 1]) {
            dp[i][j] += dp[i][j - 1];
        }
    }
}

// 创建代表棋盘每个点的矩形网格并初始化颜色和文本组件
let grid = new sd.Grid(svg).n(B[0] + 1).m(B[1] + 1);
grid.x(200).y(100).width(400).height(400);
grid.color(C.blue); // 设置网格的整体颜色为蓝色，但仅作用于填充颜色

// 设置网格的默认颜色和边框，需要修改相关设置
// grid.stroke(true).strokeWidth(2).strokeColor(C.black); // 错误：Grid 没有 stroke 方法

// 初始填充棋盘上的内容
for (let i = 0; i <= B[0]; i++) {
    for (let j = 0; j <= B[1]; j++) {
        if (checkBoard[i][j]) {
            grid.text(i, j, "X").color(i, j, C.red);
        } else {
            if (i === 0 && j === 0) {
                grid.text(i, j, dp[i][j].toString());
            } else {
                grid.text(i, j, "0");
            }
        }
    }
}

// 函数用于更新特定格子的颜色和文本内容
const updateGrid = async (i, j) => {
    await sd.pause(); // 每次更新之间暂停300毫秒
    if (checkBoard[i][j]) {
        grid.color(i, j, C.gray);
        grid.text(i, j, "X");
    } else if (i === 0 && j === 0) {
        grid.text(i, j, dp[i][j].toString());
        grid.color(i, j, C.yellow);
    } else {
        grid.color(i, j, C.green);
        grid.text(i, j, dp[i][j].toString());
    }
};

sd.init(async () => {
    for (let i = 0; i <= B[0]; i++) {
        for (let j = 0; j <= B[1]; j++) {
            await updateGrid(i, j);
        }
    }
});

sd.main(async () => {
    for (let j = 0; j <= B[1]; j++) {
        for (let i = 0; i <= B[0]; i++) {
            if (checkBoard[i][j] && (i > 0 || j > 0)) {
                await updateGrid(i, j);
            } else if (i === 0 && j === 0) {
                await updateGrid(i, j);
            } else if (i === 0 && j !== 0) {
                if (checkBoard[i][j]) {
                    dp[i][j] = 0;
                } else {
                    dp[i][j] = dp[i][j - 1];
                }
                await updateGrid(i, j);
            } else if (j === 0 && i !== 0) {
                if (checkBoard[i][j]) {
                    dp[i][j] = 0;
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
                await updateGrid(i, j);
            } else if (i > 0 && j > 0) {
                if (checkBoard[i][j]) {
                    dp[i][j] = 0;
                } else {
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
                }
                await updateGrid(i, j);
            }
        }
        await sd.pause();
    }

    await sd.pause();
    if (!checkBoard[B[0]][B[1]]) {
        grid.color(B[0], B[1], C.purple);
        grid.text(B[0], B[1], "Result: " + dp[B[0]][B[1]]);
    } else {
        grid.color(B[0], B[1], C.red);
        grid.text(B[0], B[1], "Result: 0");
    }
});
