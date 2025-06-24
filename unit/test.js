import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const grid = new sd.Grid(svg);
grid.n(21).m(21).elementWidth(30).elementHeight(30);

const startLabel = new sd.Text(svg);
startLabel.text("1").fontSize(20).color(C.green);

const blockedLabel = new sd.Text(svg);
blockedLabel.text("0").fontSize(20).color(C.red);

const generalLabel = new sd.Text(svg);
generalLabel.fontSize(20).color(C.black);

sd.init(() => {
    startLabel.x(grid.x(1) + 10).y(grid.y(1) + 20);
    blockedLabel.x(grid.x(2) + 10).y(grid.y(2) + 20);
    generalLabel.x(grid.x(3) + 10).y(grid.y(3) + 20);
});

sd.main(async () => {
    const bx = 6 + 2,
        by = 6 + 2,
        mx = 3 + 2,
        my = 3 + 2;
    const blocked = new Set(["3,3", "1,2", "2,1", "1,4", "2,5", "4,5", "5,4", "5,2", "4,1"]);
    const dp = Array.from({ length: bx + 1 }, () => Array(by + 1).fill(0));
    dp[1][1] = 1;

    for (let i = 1; i <= bx; i++) {
        for (let j = 1; j <= by; j++) {
            await sd.pause();
            const key = `${i},${j}`;
            if (blocked.has(key)) {
                const blockedText = new sd.Text(svg);
                blockedText.text("0").fontSize(20).color(C.red);
                blockedText.x(grid.x(i) + 10).y(grid.y(j) + 20);
                continue;
            }
            if (i === 1 && j === 1) {
                const startText = new sd.Text(svg);
                startText.text("1").fontSize(20).color(C.green);
                startText.x(grid.x(i) + 10).y(grid.y(j) + 20);
                continue;
            }
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            const generalText = new sd.Text(svg);
            generalText.text(dp[i][j].toString()).fontSize(20).color(C.black);
            generalText.x(grid.x(i) + 10).y(grid.y(j) + 20);
        }
    }
});
