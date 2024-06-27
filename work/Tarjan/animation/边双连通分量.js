import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const data = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [8, 10], [8, 11],
    [11, 12]
];

init();
main();

function init() {
    tree.root(1);
    data.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).strokeWidth(2);
    })
    sd.Link(tree.element(7), tree.element(2)).arrow();
    sd.Link(tree.element(10), tree.element(2)).arrow();
    sd.Link(tree.element(9), tree.element(3), sd.Curve).bending(0.5).arrow();
}

async function main() {
    const important = [[1, 2], [1, 3], [8, 11], [11, 12]];
    important.forEach(link => {
        tree.element(link[0], link[1]).strokeWidth(3).stroke(C.red);
    });
    const colorList = [C.blue, C.green, C.coral, C.grey, C.violet];
    const blocks = [
        [1],
        [3, 6, 9],
        [2, 4, 5, 7, 8, 10],
        [11],
        [12]
    ];
    blocks.forEach((block, idx) => {
        block.forEach(nodeId => {
            tree.element(nodeId).color(colorList[idx]);
        })
    })
    await sd.pause();
}