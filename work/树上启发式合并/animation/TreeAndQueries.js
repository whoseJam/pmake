import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 12;
const cols = [C.green, C.blue, C.cyan];
const tree = new sd.Tree(svg);
const colArray = new sd.Array(svg).resize(cols.length);
const sumArray = new sd.Array(svg).resize(n).start(1);
const focus = sd.Focus(tree);
const colOfNode = sd.make1d(20);
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
        tree.color(i, cols[colOfNode[i] = sd.rand(0, 2)])
    }
    tree.width(400).cx(600).y(100);
    colArray.addColor = function(idx) {
        const stk = this.element(idx).child("stk");
        stk.push().color(stk.end(), cols[idx]);
        return this;
    }
    for (let i = 0; i < cols.length; i++) {
        const e = colArray.element(i);
        e.childAs("col", new sd.Rect(e).width(20).height(20).color(cols[i]), R.aside("tc"));
    }
    colArray.cx(tree.cx()).y(tree.my() + 50);
    sumArray.cx(tree.cx()).y(colArray.my() + 30);
    sd.Index(sumArray, "t");
}

async function dfs(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
    await sd.pause();
    const newValue = colArray.intValue(colOfNode[u]) + 1;
    colArray.startAnimate().value(colOfNode[u], newValue).endAnimate();
    sumArray.startAnimate().value(newValue, sumArray.intValue(newValue) + 1).endAnimate();

    const children = tree.childrenOnTree(u);
    for (let i = 0; i < children.length; i++) {
        const v = children[i].nodeId;
        await dfs(v);
    }
}

async function main() {
    await dfs(1);
}
