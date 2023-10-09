import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let mp = sd.Grid(svg).x(380).y(180).startN(1).startM(1).drag(true).resizeable(true);
let n = 5, m = 5;
let data = R.readCharMatrix(`..####....#.#.##.#.##.#..`, n, m);
let at = sd.Rect(svg).fillOpacity(0).stroke(C.red).strokeWidth(3);
mp.n(n).m(m);
at.width(mp.elementWidth() - 3).height(mp.elementHeight() - 3);
at.cx(mp.element(1, 1).cx()).cy(mp.element(1, 1).cy());
let dx = [0, 1, 0, -1];
let dy = [1, 0, -1, 0];

for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
        mp.value(i, j, sd.Text(mp, data[i][j]));
    }
}

main();

async function main() {
    mp.element(1, 1).visited = true;
    await Dfs(1, 1);
}

async function Dfs(x, y) {
    await sd.pause();
    mp.startAnimate();
    mp.color(x, y, C.blue);
    mp.endAnimate();
    at.startAnimate();
    at.cx(mp.element(x, y).cx());
    at.cy(mp.element(x, y).cy());
    at.endAnimate();

    for (let i = 0; i < 4; i++) {
        let nx = x + dx[i];
        let ny = y + dy[i];
        if (nx < 1 || nx > n || ny < 1 || ny > n) continue;
        if (mp.element(nx, ny).visited) continue;
        if (mp.value(nx, ny).text() === "#") continue;
        mp.element(nx, ny).visited = true;

        await Dfs(nx, ny);

        await sd.pause();
        mp.element(nx, ny).visited = false;
        at.startAnimate();
        at.cx(mp.element(x, y).cx());
        at.cy(mp.element(x, y).cy());
        at.endAnimate();
    }
} 