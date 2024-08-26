import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.ValueTree(svg).width(500).layerHeight(90);
const n = 7;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7]
];

sd.init(() => {
    tree.root(1, makeGrid());
    for (let i = 2; i <= n; i++) {
        tree.newNode(i, makeGrid());
    }
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        sd.Label(tree.element(i), i, "bc", 20, 0).opacity(0)
            .startAnimate().opacity(1).endAnimate();
    }
})

function makeGrid() {
    const grid = new sd.Grid(svg).elementWidth(20).elementHeight(20).n(3).m(3).startN(1).startM(1);
    return grid;
}