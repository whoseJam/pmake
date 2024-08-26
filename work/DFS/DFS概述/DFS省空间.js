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
    const focus = sd.Focus(tree);
    const dfs = async function(x) {
        const children = tree.childrenOnTree(x);
        await sd.pause();
        focus.startAnimate().focus(x).endAnimate();
        for (let i = 0; i < children.length; i++) {
            await dfs(children[i].nodeId);
            await sd.pause();
            focus.startAnimate().focus(x).endAnimate();
        }
    }
    await dfs(1);
})

function makeGrid() {
    const grid = new sd.Grid(svg).elementWidth(20).elementHeight(20).n(3).m(3).startN(1).startM(1);
    return grid;
}