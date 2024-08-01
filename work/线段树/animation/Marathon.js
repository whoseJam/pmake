import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.GridGraph(svg).width(200).height(150);
const C = sd.color();
const tree = new sd.ValueTree(svg).width(600).layerHeight(100);
const data = "10001101";

init();
main();

function init() {
    grid.at(0, 0).newNode(1);
    grid.at(0.5, 0).newNode(2);
    grid.at(1, 1).newNode(3);
    grid.at(1, 0.5).newNode(4);
    grid.at(1, 0).newNode(5);
    grid.at(0.5, 1).newNode(6);
    grid.at(0, 0.5).newNode(7);
    grid.at(0, 1).newNode(8);
    for (let i = 1; i <= 7; i++)
        grid.newLink(i, i + 1).element(i, i + 1).arrow();
    function initArray(length) {
        const arr = new sd.Array(tree).resize(length);
        return arr;
    }
    tree.root(1, initArray(8));
    tree.newNode(2, initArray(4)); tree.newLink(1, 2);
    tree.newNode(3, initArray(4)); tree.newLink(1, 3);
    grid.cx(tree.cx()).y(tree.my() + 100);
}

async function main() {
    await sd.pause();
}