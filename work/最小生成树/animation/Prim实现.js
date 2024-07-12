import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);
const fa = sd.make1d(100);
let n = 6;
const board = new sd.Text(svg);
const links = [
    [1, 2, 4],
    [2, 4, 2],
    [1, 6, 6],
    [4, 1, 5],
    [5, 6, 3],
    [2, 5, 1],
    [3, 5, 7]
];

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0, 0).newNode(4);
    graph.at(0.5, 0.5).newNode(5);
    graph.at(0.5, 1).newNode(6)
    for (let i = 1; i <= n; i++) fa[i] = i;
    graph.cx(600).cy(300);
    board.fontSize(25).x(graph.kx(0.12)).y(graph.my() + 50);
    for (let i = 0; i < links.length; i++) {
        let x = links[i][0];
        let y = links[i][1];
        graph.newLink(x, y, links[i][2]);
        graph.element(x, y).rule(R.PointAtPathByRate(0.5, "x", "y"));
    }
}

async function main() {
    links.sort((a, b) => {
        return a[2] - b[2];
    })
    for (let i = 0; i < links.length; i++) {
        let x = links[i][0];
        let y = links[i][1];
        await sd.pause();
        const str = `检查 x=${x} y=${y} v=${links[i][2]}`;
        setText(board, str);
        
        await sd.pause();
        graph.startAnimate();
        graph.element(x, y).stroke(C.red).strokeWidth(2);
        graph.element(x).color(C.RED);
        graph.element(y).color(C.RED);
        graph.endAnimate();
        
        await sd.pause();
        graph.startAnimate();
        let fx = getFa(x);
        let fy = getFa(y);
        if (fx !== fy) {
            fa[fx] = fy;
            graph.element(x, y).stroke(C.deepSkyBlue);
        } else graph.element(x, y).stroke(C.grey);
        graph.element(x).color(C.DEFAULT);
        graph.element(y).color(C.DEFAULT);
        graph.endAnimate();
    }
}

function setText(txt, str) {
    txt.startAnimate(150).opacity(0).endAnimate();
    txt.text(str);
    txt.startAnimate(150).opacity(1).endAnimate();
}

function getFa(x) {
    if (fa[x] === x) return x;
    let ans = getFa(fa[x]);
    return ans;
}