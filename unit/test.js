import * as sd from "@/sd";

const gridSize = 20;

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
grid.n(gridSize).m(gridSize);

const startX = 0;
const startY = 0;
const endX = 6;
const endY = 6;
const horseX = 3;
const horseY = 3;

const horseControlPoints = [
    [horseX + 1, horseY + 2],
    [horseX + 2, horseY + 1],
    [horseX + 2, horseY - 1],
    [horseX + 1, horseY - 2],
    [horseX - 1, horseY - 2],
    [horseX - 2, horseY - 1],
    [horseX - 2, horseY + 1],
    [horseX - 1, horseY + 2],
];

const dp = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0));

sd.init(() => {
    grid.value(startX, startY, new sd.Text(svg, "1")).color(startX, startY, C.green);
    horseControlPoints.forEach(([x, y]) => grid.value(x, y, new sd.Text("0")).color(x, y, C.red));
    grid.value(horseX, horseY, new sd.Text(svg, "0")).color(horseX, horseY, C.green);
});

sd.main(async () => {
    dp[startX][startY] = 1;

    for (let i = 0; i <= endX; i++) {
        for (let j = 0; j <= endY; j++) {
            if ((i === startX && j === startY) || (i === horseX && j === horseY) || horseControlPoints.some(([x, y]) => x === i && y === j)) {
                await sd.pause();
                continue;
            }
            if (i > 0 && dp[i - 1][j] > 0) dp[i][j] += dp[i - 1][j];
            if (j > 0 && dp[i][j - 1] > 0) dp[i][j] += dp[i][j - 1];

            if (dp[i][j] > 0) {
                await sd.pause();
                grid.value(i, j, new sd.Text(svg, dp[i][j].toString())).color(i, j, C.blue);
            }
        }
    }
});
