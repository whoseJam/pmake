import * as sd from "../../../lib/slide";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Splay(svg);
const root = 4, n = 8;
const links = [
    [4, 3, 5],
    [3, 1, 0],
    [1, 0, 2],
    [5, 0, 7],
    [7, 6, 8]
]
const fa = sd.make1d(100);
const ch = sd.make2d(100, 2);

init();
main();

async function main() {
    await sd.pause();
    tree.startAnimate().color(6, C.blue).endAnimate();
    await rotate(tree, 6);
    await rotate(tree, 6);
    await rotate(tree, 6);
    await sd.pause();
    tree.startAnimate().color(6, C.white).endAnimate();
    await sd.pause();
}

function init() {
    tree.width(600).y(50).cx(600).root(root);
    links.forEach(data => {
        const cur = data[0];
        const lc = data[1];
        const rc = data[2];
        if (lc) link(cur, lc, 0);
        if (rc) link(cur, rc, 1);
    })
    function link(x, y, flg) {
        fa[y] = x; ch[x][flg] = y;
        if (flg === 0) tree.leftChild(x, y);
        else tree.rightChild(x, y);
    }
    tree.update();
}

/**
 * @param {sd.BinaryTree} tree
 * @param {number|string} x
 */
async function rotate(tree, x) {
    const cutAnimations = [];
    const linkAnimations = [];
    const y = fa[x], z = fa[y], L = (ch[y][0] === x ? 0 : 1), R = L^1;
    if (ch[z][0] === y) {
        const chz0 = ch[z][0];
        if (chz0) cutAnimations.push(() => tree.cut(z, chz0));
        if (z) linkAnimations.push(() => tree.leftChild(z, x));
        ch[z][0] = x;
    } else {
        const chz1 = ch[z][1];
        if (chz1) cutAnimations.push(() => tree.cut(z, chz1));
        if (z) linkAnimations.push(() => tree.rightChild(z, x));
        ch[z][1] = x;
    }
    cutAnimations.push(() => tree.cut(y, x));
    fa[x] = z;
    fa[y] = x;
    if (ch[x][R]) {
        const chxR = ch[x][R];
        cutAnimations.push(() => tree.cut(x, chxR));
        linkAnimations.push(() => tree.link(y, chxR, L));
        fa[ch[x][R]] = y;
    }
    ch[y][L] = ch[x][R];
    linkAnimations.push(() => tree.link(x, y, R));
    ch[x][R] = y;

    await sd.pause();
    tree.startAnimate();
    cutAnimations.forEach(animation => animation());
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    linkAnimations.forEach(animation => animation());
    tree.endAnimate();
}