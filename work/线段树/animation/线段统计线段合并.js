import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.ValueTree(svg).width(600).layerHeight(100);
const data = "10001101";

init();
main();

function init() {
    function initArray(length) {
        const arr = new sd.Array(tree).resize(length);
        return arr;
    }
    tree.root(1, initArray(8));
    tree.newNode(2, initArray(4)); tree.newLink(1, 2);
    tree.newNode(3, initArray(4)); tree.newLink(1, 3);
}

async function main() {
    await sd.pause();
    tree.startAnimate();
    for (let i = 0; i < 4; i++) {
        if (data[i] == "1") tree.element(2).color(i, C.orange);
    }
    for (let i = 4; i < 8; i++) {
        if (data[i] == "1") tree.element(3).color(i - 4, C.orange);
    }
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    for (let i = 0; i < 8; i++) {
        if (data[i] == "1") tree.element(1).color(i, C.orange);
    }
    tree.endAnimate();
    await sd.pause();
}