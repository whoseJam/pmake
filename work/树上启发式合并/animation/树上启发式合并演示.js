import * as sd from "@/slide";
import { DSUOnTree } from "./树上启发式合并动画库";

const svg = sd.svg();
const tree = new sd.Tree(svg);
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5], [2, 6],
    [3, 7],
    [5, 8],
    [6, 9],
    [7, 10], [7, 11],
    [8, 12]
];

init();
main();

function init() {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.width(400).cx(600).cy(300)
}

async function main() {
    await DSUOnTree(tree);
    await sd.pause();
}
