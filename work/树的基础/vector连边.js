import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let board = new sd.Text(svg).fontSize(30).x(700).y(100);
let vs = [], edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5]
];
for (let i = 1; i <= 5; i++) {
    let a = new sd.Array(svg);
    sd.Label(a, `G[${i}]`);
    vs.push(a);
}

update();

main();

async function main() {
    for (let i = 0; i < edges.length; i++) {
        let x = edges[i][0], y = edges[i][1];
        await sd.pause();
        board.text(`连接${x}和${y}`);
        await sd.pause();
        vs[x-1].startAnimate().push(y).endAnimate();
        vs[y-1].startAnimate().push(x).endAnimate();
    }
}

function update() {
    let x = 200, y = 100, dy = 50;
    for (let i = 0; i < vs.length; i++) {
        vs[i].x(x).y(y);
        y += dy;
    }
}