import * as sd from "@/sd";

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
    })
    const A = [1, 3, 4, 6, 8, 9, 12];
    for (let i = 1; i <= 12; i++) {
        if (A.includes(i)) {
            tree.element(i).color(C.coral);
        } else if (i%2==0) tree.element(i).color(C.blue);
    }
    await sd.pause();
}