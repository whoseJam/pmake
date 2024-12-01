import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const arr = new sd.Array(svg).start(1);
const dfn = new sd.Array(svg).start(1);
const focus = sd.Focus(tree);
const n = 6;
const links = [
    [1, 6],
    [6, 5],
    [6, 2],
    [2, 3],
    [2, 4]
];
const lcaFocus = sd.Focus(tree);

const panel = new sd.ValueStack(svg);
const lSlider = new sd.Slider(svg).min(1).max(n).value(1).childAs("lb", new sd.Text(svg, 1), R.aside("lc")).onChange((value) => lSlider.child("lb").text(value));
const rSlider = new sd.Slider(svg).min(1).max(n).value(n).childAs("lb", new sd.Text(svg, n), R.aside("lc")).onChange((value) => rSlider.child("lb").text(value));
const lcaButton = new sd.Button(svg).onClick(() => {
    sd.inter(async () => {
        const l = Math.min(lSlider.value(), rSlider.value());
        const r = Math.max(lSlider.value(), rSlider.value());
        await LCA(l, r);
    })
}).text("LCA*");

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        arr.push(i);
    }
    arr.cx(tree.cx()).y(tree.my() + 60);
    dfn.resize(n).x(arr.x()).y(arr.my() + 40);
    panel.push(lSlider);
    panel.push(rSlider);
    panel.push(lcaButton);
    panel.cy(tree.cy()).x(tree.mx());
})

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);

    sd.Label(dfn, "DFS序").opacity(0).startAnimate().opacity(1).endAnimate();
    await Dfs(1);
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

let tot = 0;

async function Dfs(u) {
    await sd.pause(sd.CONTINUE_FRAME);
    focus.startAnimate().focus(u).endAnimate();
    dfn.startAnimate().value(u, ++tot).endAnimate();
    const children = tree.children(u);
    for (let i = 0; i < children.length; i++) {
        await Dfs(tree.nodeId(children[i]));
        await sd.pause(sd.CONTINUE_FRAME);
        focus.startAnimate().focus(u).endAnimate();
    }
}

async function LCA(l, r) {
    arr.startAnimate(); tree.startAnimate(); dfn.startAnimate();
    for (let i = l; i <= r; i++) { arr.color(i, C.blue); dfn.color(i, C.blue); tree.color(i, C.blue); }
    arr.endAnimate(); tree.endAnimate(); dfn.endAnimate();

    await sd.pause();
    let lca = l;
    for (let i = l + 1; i <= r; i++) {
        lca = tree.nodeId(tree.lca(lca, i));
    }
    lcaFocus.startAnimate().focus(lca).endAnimate();

    await sd.pause();
    lcaFocus.startAnimate().focus(null).endAnimate();
    arr.startAnimate().color(C.white).endAnimate();
    dfn.startAnimate().color(C.white).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}