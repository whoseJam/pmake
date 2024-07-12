import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const n = 7;
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6],
    [5, 7]
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
    await showAncestorAndLCA(4, 7);
    await showAncestorAndLCA(2, 6);
    await showAncestorAndLCA(2, 7);
    await sd.pause();
}

async function showAncestorAndLCA(x, y) {
    for (let i = 1; i <= n; i++)
        tree.element(i).mark = 0;
    await sd.pause();
    const px = sd.Pointer(tree, "x", "r").startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", "l").startAnimate().moveTo(y).endAnimate();
    await sd.pause();
    climb(x); climb(y);
    let lca = undefined;
    for (let i = 1; i <= n; i++) {
        const e = tree.element(i);
        if (e.mark === 2) {
            e.startAnimate().color(C.blue).endAnimate();
            if (!lca || tree.depth(lca) < tree.depth(i))
                lca = i;
        }
    }
    await sd.pause();
    tree.startAnimate().color(lca, C.green).endAnimate();
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
    tree.startAnimate().color(C.white).endAnimate();
}

function climb(x) {
    let cnt = 0;
    while (x && cnt <= 10) {
        tree.element(x).mark++;
        x = tree.father(x);
        if (!x) break; x = x.nodeId;
        cnt++;
    }
}