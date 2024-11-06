import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const cols = [C.green, C.blue, C.cyan, C.orange, C.purple];
const tree = new sd.Tree(svg);
const colArray = new sd.Array(svg).resize(cols.length);
const focus = sd.Focus(tree);
const colOfNode = sd.make1d(20);
const n = 12;
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5], [2, 6],
    [3, 7],
    [5, 8],
    [6, 9],
    [7, 10], [7, 11],
    [8, 12]
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        tree.color(i, cols[colOfNode[i] = sd.rand(0, cols.length - 1)]);
    }
    tree.width(400).cx(600).y(100);
    colArray.addColor = function(idx) {
        const stk = this.element(idx).child("stk");
        stk.push().color(stk.end(), cols[idx]);
        return this;
    }
    for (let i = 0; i < cols.length; i++) {
        colArray.value(i, new sd.Rect(colArray).color(cols[i]));
        const stk = new sd.Stack(colArray).elementWidth(20).elementHeight(20);
        colArray.element(i).childAs("stk", stk, R.aside("bc"));
    }
    colArray.x(tree.mx() + 50).y(tree.y());
}

async function dfs(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
    await sd.pause();
    colArray.startAnimate().addColor(colOfNode[u]).endAnimate();

    const children = tree.childrenOnTree(u);
    for (let i = 0; i < children.length; i++) {
        const v = children[i].nodeId;
        await dfs(v);
    }
}

async function main() {
    await dfs(2);
}
