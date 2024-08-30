import * as sd from "@/sd";

const svg = sd.svg();
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
    const nodeU = tree.element(u);
    while (u) {
        u = tree.father(u).nodeId;
        if (!u) break;
        const nodeCur = tree.element(u);
        await sd.pause();
        nodeCur.startAnimate().color(C.green).endAnimate();
        sd.Link(nodeU, nodeCur, sd.Curve).startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        nodeCur.startAnimate().color(C.white).endAnimate();
    }
});