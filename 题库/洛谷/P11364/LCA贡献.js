import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(500);
const stk = new sd.ValueStack(svg).start(1);
const lcaData = sd.make2d(20, 20);
const n = 6;
const links = [
    [1, 6],
    [6, 5],
    [6, 2],
    [2, 3],
    [2, 4]
];
const lcaFocus = sd.Focus(tree);

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    stk.x(tree.mx() + 20).y(tree.y() - 20);
    for (let i = 1; i <= n; i++) {
        stk.push(new sd.ValueArray(svg).elementWidth(60));
        sd.Label(stk.lastElement(), `lca=${i}`);
    }
})

sd.main(async () => {
    for (let l = 1; l <= n; l++) {
        for (let r = l; r <= n; r++) {
            await sd.pause();
            await LCA(l, r);
        }
    }
})

async function LCA(l, r) {
    const text = new sd.Text(svg,`[${l},${r}]`);
    text.cx(tree.cx()).y(tree.my() + 20);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
            
    tree.startAnimate();
    for (let i = l; i <= r; i++) tree.color(i, C.blue);
    tree.endAnimate();
    
    await sd.pause();
    let lca = l;
    for (let i = l + 1; i <= r; i++) {
        lca = tree.nodeId(tree.lca(lca, i));
    }
    lcaFocus.startAnimate().focus(lca).endAnimate();
    stk.element(lca).startAnimate().pushFromExistElement(text).endAnimate();
    lcaData[l][r] = lca;

    await sd.pause();
    lcaFocus.startAnimate().focus(null).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}