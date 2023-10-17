import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let dx = [1, 1, 2, 2, -1, -1, -2, -2, 0];
let dy = [2, -2, 1, -1, 2, -2, 1, -1, 0];
let n = 5, m = 9;
let cx = 4, cy = 3;
let mp = sd.Grid(svg).n(n).m(m).startN(1).startM(1);
mp.x(100).y(100);
for (let i = 0; i < 9; i++) {
    let tx = cx + dx[i];
    let ty = cy + dy[i];
    if (1 <= tx && tx <= n && 1 <= ty && ty <= m)
        mp.value(tx, ty, sd.Circle(svg).color(C.ORANGE));
}

main();

async function main() {
    await sd.pause();
    mp.startAnimate().color(1, 1, C.blue).endAnimate();
    await sd.pause();
    mp.startAnimate().value(1, 1, sd.Text(svg, 1)).endAnimate();
    for (let j = 1; j <= m; j++) {
        for (let i = 1; i <= n; i++) {
            if (mp.value(i, j)) continue;
            await sd.pause();
            mp.startAnimate();
            mp.color(i, j, C.blue);
            mp.endAnimate();
            await sd.pause();
            mp.startAnimate();
            let ans = 0;
            if (i-1 >= 1 && mp.value(i-1, j).text) ans += +mp.value(i-1, j).text();
            if (j-1 >= 1 && mp.value(i, j-1).text) ans += +mp.value(i, j-1).text();
            mp.value(i, j, sd.Text(svg, ans));
            mp.endAnimate();
        }
    }
}