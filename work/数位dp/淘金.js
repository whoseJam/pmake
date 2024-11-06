import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();

二维转一维();

async function 一维转移() {
    let n = 25;
    let row = new sd.Array(svg).length(n).start(1).x(50).y(300);
    sd.Index(row, "t");
    function f(x) {
        let ans = 1;
        while (x > 0) {
            ans *= x % 10;
            x = Math.floor(x / 10);
        } return ans;
    }
    let data1d = sd.make1d(100 ,1);
    for (let i = 1; i <= n; i++) {
        let ni = f(i);
        if (ni === i) continue;
        data1d[i]--;
        if (1 <= ni &&ni <= n) data1d[ni]++;
    }
    for (let i = 1; i <= n; i++)
        row.value(i, data1d[i]);
    for (let i = 1; i <= n; i++) {
        let ni = f(i);
        if (ni === i || ni <= 0 || ni > n) continue;
        sd.Link(row.element(i), row.element(ni), sd.Curve, "cx", "y", "cx", "y").arrow().bending(0.25);
    }
    await sd.pause();
}

async function 二维转一维() {
    function resizeElement(node) {
        node.elementWidth(20);
        node.elementHeight(20);
    }
    let n = 15;
    let g = new sd.Grid(svg).n(n).m(n).startN(1).startM(1).x(100).y(100);
    let row = new sd.Array(svg).length(n).start(1);
    let col = new sd.Stack(svg).length(n).start(1);
    resizeElement(g); resizeElement(row); resizeElement(col);
    sd.Index(row, "t");
    sd.Index(col, "l");
    g.childAs("row", row, R.aside("tc"));
    g.childAs("col", col, R.aside("lc"));
    function f(x) {
        let ans = 1;
        while (x > 0) {
            ans *= x % 10;
            x = Math.floor(x / 10);
        } return ans;
    }
    let data = sd.make2d(100, 100, 1);
    let data1d = sd.make1d(100 ,1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            let ni = f(i), nj = f(j);
            if (ni === i && nj === j) continue;
            data[i][j]--;
            if (1 <= ni && ni <= n && 1 <= nj && nj <= n)
                data[ni][nj]++;
        }
        let ni = f(i);
        if (ni === i) continue;
        data1d[i]--;
        if (1 <= ni &&ni <= n) data1d[ni]++;
    }
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            g.value(i, j, data[i][j]);
    for (let i = 1; i <= n; i++) {
        col.value(i, data1d[i]);
        row.value(i, data1d[i]);
    }
    for (let i = 1; i <= n; i++) {
        let ni = f(i);
        if (ni === i || ni <= 0 || ni > n) continue;
        sd.Link(row.element(i), row.element(ni), sd.Curve, "cx", "y", "cx", "y").arrow().bending(0.25);
        sd.Link(col.element(i), col.element(ni), sd.Curve, "x", "cy", "x", "cy").arrow().bending(-0.25);
    }
    await sd.pause();
}

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