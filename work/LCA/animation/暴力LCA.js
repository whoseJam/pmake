import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600);
const n = 16;
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5], [3, 6], [4, 7], [5, 8], [6, 9], [7, 10],
    [8, 11], [8, 12], [9, 13], [10, 14], [11, 15], [12, 16]
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(300);
}

async function main() {
    await bruteForceLCA(4, 7);
    await bruteForceLCA(4, 12);
    await bruteForceLCA(10, 16);
    await sd.pause();
}

async function bruteForceLCA(x, y) {
    await sd.pause();
    if (tree.depth(x) > tree.depth(y)) {
        let tmp = x; x = y; y = tmp;
    }
    const px = sd.Pointer(tree, "x", "r").startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", "l").startAnimate().moveTo(y).endAnimate();
    while (tree.depth(y) > tree.depth(x)) {
        const fa = tree.father(y).nodeId;
        await sd.pause();
        py.startAnimate().moveTo(fa).endAnimate();
        y = fa;
    }
    while (x !== y) {
        await sd.pause();
        const fax = tree.father(x).nodeId;
        const fay = tree.father(y).nodeId;
        px.startAnimate().moveTo(fax).endAnimate();
        py.startAnimate().moveTo(fay).endAnimate();
        x = fax;
        y = fay;
    }
    await sd.pause();
    tree.startAnimate().color(x, C.green).endAnimate();
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
    tree.startAnimate().color(x, C.white).endAnimate();
}