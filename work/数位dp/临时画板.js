import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();

淘金();

async function 淘金() {
    let n = 11;
    let g = new sd.Grid(svg).n(n).m(n).startN(1).startM(1).x(50).y(50);
    sd.Index(g, "t");
    sd.Index(g, "l");
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            g.value(i, j, 1);
    await sd.pause();
    function f(x) {
        let ans = 1;
        while (x > 0) {
            ans *= x % 10;
            x = Math.floor(x / 10);
        } return ans;
    }
    let data = sd.make2d(100, 100, 1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            let ni = f(i), nj = f(j);
            if (ni === i && nj === j) continue;
            data[i][j]--;
            if (1 <= ni && ni <= n && 1 <= nj && nj <= n)
                data[ni][nj]++;
        }
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            g.value(i, j, data[i][j]);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            let ni = f(i), nj = f(j);
            if (ni === i && nj === j) continue;
            link(i, j, ni, nj);
        }
    }
    function link(x, y, nx, ny) {
        if (nx > n || nx < 1 || ny > n || ny < 1) return;
        let v1 = g.value(x, y), v2 = g.value(nx, ny);
        let l = new sd.Line(svg).arrow();
        l.source(v1.cx(), v1.cy());
        l.target(v2.cx(), v2.cy());
        sd.trim(l, v1, v2);
    }
}