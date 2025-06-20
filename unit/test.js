import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const grid = new sd.Grid(svg);

const n = 6,
    m = 6;
const horseX = 3,
    horseY = 3;

const horseControl = [
    [0, 0],
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
];

function isHorseControl(x, y) {
    for (let [dx, dy] of horseControl) {
        if (x === horseX + dx && y === horseY + dy) {
            return true;
        }
    }
    return false;
}

const dp = [];
for (let i = 0; i <= n; i++) {
    dp[i] = [];
    for (let j = 0; j <= m; j++) {
        dp[i][j] = 0;
    }
}

sd.init(() => {
    grid.n(n + 1).m(m + 1);
    grid.x(50).y(50);

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            grid.text(i, j, "0");
            if (isHorseControl(i, j)) {
                grid.color(i, j, C.red);
            } else {
                grid.color(i, j, C.grey);
            }
        }
    }

    grid.text(0, 0, "1").color(0, 0, C.green);
    dp[0][0] = 1;
});

sd.main(async () => {
    await sd.pause();

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            if (i === 0 && j === 0) continue;

            await sd.pause();

            grid.startAnimate().color(i, j, C.yellow).endAnimate();

            if (isHorseControl(i, j)) {
                dp[i][j] = 0;
                grid.startAnimate().text(i, j, "0").color(i, j, C.red).endAnimate();
            } else {
                let value = 0;
                if (i > 0 && !isHorseControl(i - 1, j)) {
                    value += dp[i - 1][j];
                }
                if (j > 0 && !isHorseControl(i, j - 1)) {
                    value += dp[i][j - 1];
                }
                dp[i][j] = value;

                grid.startAnimate().text(i, j, value.toString()).color(i, j, C.blue).endAnimate();
            }

            await sd.pause();
        }
    }

    await sd.pause();
    grid.startAnimate().color(n, m, C.green).endAnimate();
});
