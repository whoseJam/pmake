import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// 创建棋盘网格
const grid = new sd.Grid(svg);
const n = 6,
    m = 6;
const horseX = 3,
    horseY = 3;

// 马的控制点偏移量
const horseControl = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
];

// 动态规划数组
let dp = [];
for (let i = 0; i <= n; i++) {
    dp[i] = [];
    for (let j = 0; j <= m; j++) {
        dp[i][j] = 0;
    }
}

// 初始化马的控制点
let horseControlPoints = new Set();
horseControlPoints.add(`${horseX},${horseY}`);
for (let i = 0; i < horseControl.length; i++) {
    const nx = horseX + horseControl[i][0];
    const ny = horseY + horseControl[i][1];
    if (nx >= 0 && nx <= n && ny >= 0 && ny <= m) {
        horseControlPoints.add(`${nx},${ny}`);
    }
}

sd.init(() => {
    // 初始化网格
    grid.n(n + 1).m(m + 1);
    grid.x(50).y(50);

    // 初始化所有格子
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            const text = new sd.Text(svg);
            text.text("0");
            grid.value(i, j, text);
        }
    }

    // 设置起始点
    dp[0][0] = 1;
    grid.text(0, 0, "1");
    grid.color(0, 0, C.green);

    // 标记马的控制点
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            if (horseControlPoints.has(`${i},${j}`)) {
                grid.color(i, j, C.red);
                grid.text(i, j, "0");
            }
        }
    }
});

sd.main(async () => {
    await sd.pause();

    // 逐行逐列进行动态规划
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            if (i === 0 && j === 0) continue;

            // 高亮当前处理的格子
            grid.startAnimate().color(i, j, C.yellow).endAnimate();
            await sd.pause();

            if (!horseControlPoints.has(`${i},${j}`)) {
                let value = 0;

                // 从上方来的路径
                if (i > 0) {
                    value += dp[i - 1][j];
                }

                // 从左方来的路径
                if (j > 0) {
                    value += dp[i][j - 1];
                }

                dp[i][j] = value;
                grid.startAnimate().text(i, j, value.toString()).endAnimate();
                await sd.pause();

                // 恢复正常颜色
                grid.startAnimate().color(i, j, C.white).endAnimate();
            } else {
                // 马的控制点保持红色
                grid.startAnimate().color(i, j, C.red).endAnimate();
            }

            await sd.pause();
        }
    }

    // 高亮终点
    grid.startAnimate().color(n, m, C.blue).endAnimate();
    await sd.pause();
});
