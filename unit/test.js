import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const grid = new sd.Grid(svg);
const bx = 6,
    by = 6,
    mx = 3,
    my = 3;

const s = Array.from({ length: bx + 1 }, () => Array.from({ length: by + 1 }, () => false));

s[mx][my] = true;
const dx = [-2, -1, 1, 2, 2, 1, -1, -2];
const dy = [1, 2, 2, 1, -1, -2, -2, -1];
for (let i = 0; i < 8; i++) {
    const x = mx + dx[i];
    const y = my + dy[i];
    if (x >= 0 && x <= bx && y >= 0 && y <= by) {
        s[x][y] = true;
    }
}

sd.init(() => {
    grid.n(bx + 1).m(by + 1);
    for (let i = 0; i <= bx; i++) {
        for (let j = 0; j <= by; j++) {
            const rect = new sd.Rect(svg);
            rect.width(50)
                .height(50)
                .x(i * 60 + 50)
                .y(j * 60 + 50)
                .opacity(0.5)
                .color(C.white)
                .stroke(C.black);
            if (s[i][j]) {
                rect.color(C.red);
            }
            grid.insert(i, j, rect);
            const text = new sd.Text(svg, "0").fontSize(16).fill(C.black);
            text.cx(i * 60 + 50 + 25).cy(j * 60 + 50 + 25);
            grid.value(i, j, text);
        }
    }
    const startText = new sd.Text(svg, "1").fontSize(16).fill(C.black);
    startText.cx(75).cy(75);
    grid.value(0, 0, startText);
    grid.color(0, 0, C.green);
});

sd.main(async () => {
    const f = Array.from({ length: bx + 1 }, () => Array.from({ length: by + 1 }, () => 0));
    f[0][0] = 1;
    for (let i = 0; i <= bx; i++) {
        for (let j = 0; j <= by; j++) {
            if (s[i][j]) {
                continue;
            }
            if (i > 0) {
                f[i][j] += f[i - 1][j];
            }
            if (j > 0) {
                f[i][j] += f[i][j - 1];
            }
            if (i !== 0 || j !== 0) {
                await sd.pause();
                const text = new sd.Text(svg, f[i][j].toString()).fontSize(16).fill(C.black);
                text.cx(i * 60 + 50 + 25).cy(j * 60 + 50 + 25);
                grid.value(i, j, text);
                grid.color(i, j, C.blue);
            }
        }
    }
});
