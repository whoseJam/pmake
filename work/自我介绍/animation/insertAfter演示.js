import * as sd from "@/sd";
import { findNextWithoutAnimation, rotate } from "./Splay基础动画库";
import { findPrev } from "./Splay基础动画库";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Splay(svg);
const root = 3, n = 8;
const links = [
    [4, 0, 5],
    [3, 1, 4],
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
    tree.startAnimate().color(5, C.blue).endAnimate();
    await rotate(tree, 5, fa, ch);
    await rotate(tree, 5, fa, ch);
    await sd.pause();
    const next = findNextWithoutAnimation(tree, fa, ch);
    tree.startAnimate().color(next, C.orange).endAnimate();
    await rotate(tree, next, fa, ch);
    await sd.pause();
    tree.startAnimate().color(5, C.white).color(next, C.white).endAnimate();
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
