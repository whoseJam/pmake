import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const links = [
    [1, 2],
    [1, 3],
    [2, 5],
    [2, 6],
    [2, 7],
    [3, 8],
    [3, 9],
    [9, 10],
    [9, 11]
];
const t = new sd.Tree(svg).width(600);
const fa = sd.make1d(100);
t.root(1);

init();
main();

function init() {
    fa[1] = 1;
    links.forEach(link => {
        t.link(link[0], link[1]);
        fa[link[1]] = link[0];
    });
}

async function main() {
    let nodes = [];
    function getFa(x) {
        nodes.push(x);
        if (fa[x] === x) return x;
        getFa(fa[x]);
    }
    getFa(10);
    await sd.pause();
    t.startAnimate();
    nodes.forEach(node => t.color(node, C.blue));
    t.endAnimate();
    await sd.pause();
    t.startAnimate().freeze();
    for (let i = 0; i < nodes.length - 1; i++) {
        t.cut(nodes[i + 1], nodes[i]);
        t.link(1, nodes[i]);
    }
    t.unfreeze().endAnimate();
    await sd.pause();
}