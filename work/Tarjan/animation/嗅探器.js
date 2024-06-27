import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const data = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [8, 10], [8, 11],
    [11, 12]
];

init();
main();

function init() {
    tree.root(1);
    tree.color(1, C.blue);
    data.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).strokeWidth(2);
    })
    sd.Link(tree.element(7), tree.element(2)).arrow();
    sd.Link(tree.element(10), tree.element(2)).arrow();
    sd.Link(tree.element(9), tree.element(3), sd.Curve).bending(0.5).arrow();
    sd.Link(tree.element(5), tree.element(1)).arrow();
}

async function main() {
    const important = [1, 2, 3, 11];
    important.forEach(nodeId => {
        tree.element(nodeId).strokeWidth(3).stroke(C.red);
    })
    const ckpoint = [7, 10, 12, 9]
    for (let i = 0; i < ckpoint.length; i++) {
        await sd.pause();
        tree.startAnimate();
        if (i > 0) tree.color(ckpoint[i-1], C.white);
        tree.color(ckpoint[i], C.deepSkyBlue);
        tree.endAnimate();
    }
    await sd.pause();
}