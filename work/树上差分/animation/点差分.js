import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 6;
const t = new sd.Tree(svg).width(600).cx(600).y(100);
const links = [
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6]
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
    t.root(1);
    links.forEach(link => t.link(link[0], link[1]));
    for (let i = 1; i <= n; i++) {
        const e = t.element(i);
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
    }
    stack.cx(t.cx()).y(t.my() + 50);
}

async function main() {
    await sd.pause();
}

async function addPath(u, v) {
    t.element(u).incBy(1);
    t.element(v).incBy(1);
    const lca = t.lca(u, v);
    t.element(lca).incBy(-1);
    const faLca = t.father(lca);
    if (faLca) {
        t.element(faLca.nodeId).incBy(-1);
    }
}