import * as sd from "../../../lib/slide";

const svg = sd.svg();
const tree = new sd.BinaryTree(svg).width(500).cx(600).cy(300);
const instr = new sd.Text(svg, `Ask id = ${2}`);
const focus = sd.Focus(tree);
const data = [
    [1, 12, "Az"],
    [2, 10, "By"],
    [3, 7, "Ct"],
    [4, 1, "Tg"],
    [5, 2, "Rr"],
];
const links = [
    { x: 1, lc: 2 },
    { x: 2, lc: 3 },
    { x: 3, lc: 4 },
    { x: 4, rc: 5 },
];

init();
main();

function init() {
    tree.root(1, 12);
    for (let i = 1; i < data.length; i++)
        tree.newNode(data[i][0], data[i][1]);
    data.forEach(item => {
        const node = tree.element(item[0]);
        sd.Label(node, item[2], "rc", 20, 4);
    });
    links.forEach(link => {
        const x = link.x;
        if (link.lc) tree.leftChild(x, link.lc);
        if (link.rc) tree.rightChild(x, link.rc);
    });
    tree.update();
    instr.x(400).y(tree.root().y());
}

async function main() {
    await find(1, 2);
    await sd.pause();
}

async function find(x, value) {
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    const curValue = tree.intValue(x);
    if (curValue === value) return;
    if (curValue > value) await find(tree.leftChild(x).nodeId, value);
    else await find(tree.rightChild(x).nodeId, value);
}