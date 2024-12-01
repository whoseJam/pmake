import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 6;
const lcaData = I.readIntMatrix(`
1 1 1 1 1 1
0 2 2 2 6 6
0 0 3 2 6 6
0 0 0 4 6 6
0 0 0 0 5 6 
0 0 0 0 0 6`, n, n);

sd.init(() => {
    const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
    sd.Index(grid, "t");
    sd.Index(grid, "l");
    for (let l = 1; l <= n; l++) {
        for (let r = 1; r <= n; r++) {
            grid.value(l, r, lcaData[l][r]);
        }
    }
    grid.opacity(0).startAnimate().opacity(1).endAnimate();
})

sd.main(async () => {

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