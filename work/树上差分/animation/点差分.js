import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 9;
const tree = new sd.Tree(svg).width(400).cx(400).y(100);
const subTree = new sd.Tree(svg).width(400).cx(800).y(100);
const links = [
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6], [5, 7], [5, 8], [6, 9]
];

const stack = new sd.ValueStack(svg);
const u = new sd.Input(stack).label("u");
const v = new sd.Input(stack).label("v");
const submit = new sd.Button(stack).text("提交").onClick(() => {
    addPath(u.value(), v.value());
});
stack.push(u).push(v).push(submit);


init();
main();

function init() {
    tree.root(1);
    subTree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        subTree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        const e = tree.element(i);
        e.childAs("del", new sd.Text(e, `+0`), R.Aside("lc"));
        e.del = 0;
        e.incBy = function(d) {
            this.del += d;
            const text = this.child("del");
            text.startAnimate().opacity(0).endAnimate();
            text.text((this.del >= 0 ? "+" : "-") + Math.abs(d));
            text.startAnimate().opacity(1).endAnimate();
            return this;
        }
        const E = subTree.element(i);
        E.childAs("sum", new sd.Text(E, "0"), R.Aside("lc"));
        E.sum = 0;
        E.changeTo = function(d) {
            this.sum = d;
            const text = this.child("sum");
            text.startAnimate().opacity(0).endAnimate();
            text.text(d);
            text.startAnimate().opacity(1).endAnimate();
            return this;
        }
    }
    stack.cx(600).y(subTree.my() + 50);
}

async function main() {
    await sd.pause();
}

async function addPath(u, v) {
    await sd.pause();
    tree.element(u).incBy(1);
    tree.element(v).incBy(1);
    const lca = tree.lca(u, v);
    tree.element(lca).incBy(-1);
    const faLca = tree.father(lca);
    if (faLca) {
        tree.element(faLca.nodeId).incBy(-1);
    }
    dfs(1);
}

function dfs(u) {
    const children = subTree.childrenOnTree(u);
    const nodeU = subTree.element(u);
    let sum = tree.element(u).del;
    for (let i = 0; i < children.length; i++) {
        dfs(children[i].nodeId);
        sum += children[i].sum;
    }
    if (nodeU.sum !== sum) {
        nodeU.changeTo(sum);
    }
}