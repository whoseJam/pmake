import * as sd from "@/sd";
const svg = sd.svg();
const div = sd.div();
const C = sd.color();

// 马的控制点
const controlPoints = [
    [1, 2],
    [2, 1],
    [-1, 2],
    [2, -1],
    [1, -2],
    [-2, 1],
    [-1, -2],
    [-2, -1],
];

function main() {
    let [n, m, x_h, y_h] = [6, 6, 3, 3]; // B点为(6, 6)、马的坐标为(3, 3)
    return [n, m, x_h, y_h];
}

const [n, m, x_h, y_h] = main();
const N = n + 1; // 行的数量
const M = m + 1; // 列的数量

const grid = new sd.Grid(svg).n(N).m(M); // 构建(n+1) x (m+1)的网格，包括点(0,0)到点(n,m)
const dp = new Array(N).fill(0).map(() => new Array(M).fill(0));
dp[0][0] = 1;

// 验证点是否在棋盘范围内
const validatePosition = (x, y) => x >= 0 && x <= n && y >= 0 && y <= m;
const isBlocked = (x, y) => {
    if (x === x_h && y === y_h) return true;
    for (const [dx, dy] of controlPoints) {
        if (x === x_h + dx && y === y_h + dy) {
            return true;
        }
    }
    return false;
};

// 初始化棋盘，标记马及其控制点
sd.init(() => {
    grid.forEachElement((cell, i, j) => {
        cell.strokeWidth(1).stroke(C.black).fill("white");
        const text = new sd.Text(cell, ""); // Pass cell as the target and "" as the initial text
        cell.value(text);

        if (isBlocked(i, j)) {
            cell.color(C.red);
            text.text("0");
        } else if (i === 0 && j === 0) {
            cell.color(C.green);
            text.text("1");
        } else {
            cell.color(C.white);
            text.text("");
        }
    });

    // 标识出棋盘的起始点、终点和马的位置
    new sd.Text(svg)
        .text("A (0,0)")
        .x(grid.element(0, 0).cx() - 25)
        .y(grid.element(0, 0).cy() - 20)
        .fontSize(12);

    new sd.Text(svg)
        .text(`B (${n},${m})`)
        .x(grid.element(n, m).cx() + 5)
        .y(grid.element(n, m).cy() + 10)
        .fontSize(12);

    new sd.Text(svg).text("马").x(grid.element(x_h, y_h).cx()).y(grid.element(x_h, y_h).cy()).fontSize(12).fill(C.white);
});

sd.main(async () => {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (isBlocked(i, j)) {
                continue;
            }

            // 高亮当前正在处理的格子
            let oldColor = grid.color(i, j);
            grid.color(i, j, C.orange);

            // 等待一帧以便看清当前正在处理的格子是高亮的
            await sd.pause();

            if (i > 0) dp[i][j] += dp[i - 1][j];
            if (j > 0) dp[i][j] += dp[i][j - 1];

            if (dp[i][j] > 0) {
                grid.color(i, j, C.blue);
                const text = grid.element(i, j).value();
                if (text && text instanceof sd.Text) {
                    text.text(dp[i][j].toString());
                }
            }
            await sd.pause();

            // 恢复原来的颜色
            if (!isBlocked(i, j)) {
                grid.color(i, j, oldColor);
            } else {
                grid.color(i, j, C.red);
            }
        }
    }

    const answer = dp[n][m];
    new sd.Text(div).text(`从A点 (0, 0) 到B点 (${n}, ${m}) 的路径数量是: ${answer}`).x(0).y(-50).fontSize(14);

    await sd.pause();
});
