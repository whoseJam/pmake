import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [4, 5],
    [5, 6],
    [6, 7]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
})

sd.main(async () => {
    let u = 7;
    let i = 0;
    const nodeU = tree.element(u);
    await sd.pause();
    nodeU.startAnimate().color(C.blue).endAnimate();
    while (u) {
        u = tree.father(u).nodeId;
        if (!u) break;
        const nodeCur = tree.element(u);
        await sd.pause();
        nodeCur.startAnimate().color(C.green).endAnimate();
        const link = sd.Link(nodeU, nodeCur, sd.Curve).bending(0.5);
        nodeU.update();
        link.startAnimate().pointStoT().value(`${++i}级祖先`, R.pointAtPathByRate(0.5, "x", "cy")).endAnimate().arrow();
        await sd.pause();
        link.startAnimate().opacity(0).endAnimate();
        nodeCur.startAnimate().color(C.white).endAnimate();
    }
});