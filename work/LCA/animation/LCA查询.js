import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600).layerHeight(50);
const n = 16;
const m = 4;
const fa = sd.make2d(20, 10, 0);
const dep = sd.make1d(20);
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6], [5, 7],
    [7, 8], [7, 9], [9, 10],
    [10, 11], [11, 12], [12, 13],
    [13, 14], [14, 15], [15, 16]
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(300);
    for (let i = 2; i <= n; i++) {
        fa[i][0] = tree.father(i).nodeId;
        dep[i] = dep[fa[i][0]] + 1;
        for (let j = 1; j < m; j++) {
            fa[i][j] = fa[fa[i][j-1]][j-1];
        }
    }
}

async function main() {
    await LCA(2, 16);
    await LCA(8, 9);
    await LCA(6, 16);
    await sd.pause();
}

async function LCA(x, y) {
    if (dep[x] > dep[y]) { let tmp = x; x = y; y = tmp; }
    await sd.pause();
    tree.startAnimate();
    const oldX = x, oldY = y;
    tree.element(x).strokeWidth(3).stroke(C.red).endAnimate();
    tree.element(y).strokeWidth(3).stroke(C.red).endAnimate();
    tree.endAnimate();
    const px = sd.Pointer(tree, "x", "r");
    const py = sd.Pointer(tree, "y", "l");
    px.startAnimate().moveTo(x).endAnimate();
    py.startAnimate().moveTo(y).endAnimate();
    const linkTo = (a, b) => {
        const l = sd.Link(
            tree.element(a),
            tree.element(b),
            sd.Curve
        ).bending(-0.5);
        tree.element(a).update();
        l.startAnimate().pointStoT().endAnimate().arrow();
        return l;
    }
    for (let i = m - 1; i >= 0; i--) {
        if (dep[fa[y][i]] >= dep[x]) {
            await sd.pause();
            const l = linkTo(y, fa[y][i]);
            await sd.pause();
            py.startAnimate().moveTo(fa[y][i]).endAnimate();
            await sd.pause();
            l.startAnimate().opacity(0).remove();
            y = fa[y][i];
        }
    }
    if (x !== y) {
        for (let i = m - 1; i >= 0; i--) {
            if (fa[x][i] === fa[y][i] && fa[x][i] !== 0) {
                await sd.pause();
                const ls = [linkTo(x, fa[x][i]), linkTo(y, fa[y][i])];
                await sd.pause();
                tree.startAnimate().color(fa[x][i], C.red).endAnimate();
                await sd.pause();
                ls.forEach(l => l.startAnimate().opacity(0).remove());
                tree.startAnimate().color(fa[x][i], C.white).endAnimate();
            }
            if (fa[x][i] !== fa[y][i]) {
                await sd.pause();
                const ls = [linkTo(x, fa[x][i]), linkTo(y, fa[y][i])];
                await sd.pause();
                px.startAnimate().moveTo(fa[x][i]).endAnimate();
                py.startAnimate().moveTo(fa[y][i]).endAnimate();
                await sd.pause();
                ls.forEach(l => l.startAnimate().opacity(0).remove());
                x = fa[x][i];
                y = fa[y][i];
            }
        }
        await sd.pause();
        px.startAnimate().moveTo(fa[x][0]).endAnimate(); x = fa[x][0];
        py.startAnimate().moveTo(fa[y][0]).endAnimate(); y = fa[y][0];
    }
    await sd.pause();
    tree.startAnimate().color(x, C.green).endAnimate();
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
    tree.startAnimate();
    tree.color(x, C.white);
    tree.element(oldX).strokeWidth(1).stroke(C.black);
    tree.element(oldY).strokeWidth(1).stroke(C.black);
    tree.endAnimate();

}