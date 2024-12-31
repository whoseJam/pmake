import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const cols = [C.green, C.blue, C.cyan];
const tree = new sd.Tree(svg);
const focus = sd.Focus(tree);
const depArray = new sd.Array(svg).resize(8).start(1);
sd.Index(depArray, "t");
const dep = sd.make1d(20);
const n = 12;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [7, 11],
    [8, 12],
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.width(400).cx(600).y(100);
    depArray.addNode = function (idx) {
        const stk = this.element(idx).child("stk");
        stk.push().color(stk.end(), C.BLUE);
        return this;
    };
    for (let i = 1; i <= depArray.length(); i++) {
        const stk = new sd.Stack(depArray).elementWidth(20).elementHeight(20);
        depArray.element(i).childAs("stk", stk, R.aside("bc"));
    }
    depArray.x(tree.mx() + 50).y(tree.y());
}

async function dfs(u, f) {
    dep[u] = dep[f] + 1;

    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
    await sd.pause();
    depArray.startAnimate().addNode(dep[u]).endAnimate();

    const children = tree.children(u);
    for (let i = 0; i < children.length; i++) {
        const v = children[i].nodeId;
        await dfs(v, u);
    }
}

async function main() {
    await dfs(1, 0);
}
