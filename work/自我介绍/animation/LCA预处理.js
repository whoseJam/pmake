import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600).layerHeight(50);
const n = 10;
const m = 3;
const st = new sd.Grid(svg).n(m).m(n).startM(1);
const fa = sd.make2d(20, 10, 0);
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6], [5, 7],
    [7, 8], [7, 9], [9, 10]
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(200);
    for (let i = 1; i <= n; i++) {
        st.children.push(new sd.Text(st, i).fontSize(20), function(parent, child) {
            const elem = st.element(m - 1, i);
            child.cx(elem.cx());
            child.y(elem.my() + 3);
        })
    }
    for (let i = 0; i < m; i++) {
        st.children.push(new sd.Mathjax(st).math(`2^${i}`).height(20), function(parent, child) {
            const elem = st.element(m - 1 - i, 1);
            child.mx(elem.x() - 5);
            child.cy(elem.cy());
        })
    }
    st.cx(600).y(tree.my() + 40);
}

async function main() {
    for (let i = 2; i <= n; i++)
        await prepare(i);
    await sd.pause();
}

async function prepare(u) {
    await sd.pause();
    fa[u][0] = tree.father(u)?.nodeId;
    if (!fa[u][0]) fa[u][0] = 0;
    const nodeU = tree.element(u);
    const ls = [];
    for (let i = 0; i < m; i++) {
        if (i > 0) fa[u][i] = fa[fa[u][i-1]][i-1];
        if (fa[u][i]) {
            const nodeFa = tree.element(fa[u][i]);
            const l = sd.Link(nodeU, nodeFa, sd.Curve).bending(-0.5);
            nodeU.update();
            l.startAnimate()
                .pointStoT()
                .endAnimate()
                .arrow();
            ls.push(l);
        }
    }
    await sd.pause();
    st.startAnimate();
    for (let i = 0; i < m; i++) {
        if (fa[u][i]) {
            st.color(m - i - 1, u, C.green);
            st.value(m - i - 1, u, fa[u][i]);
        }
    }
    st.endAnimate();
    await sd.pause();
    st.startAnimate().color(C.white).endAnimate();
    ls.forEach(l => {
        l.startAnimate().opacity(0).remove();
    });
}
