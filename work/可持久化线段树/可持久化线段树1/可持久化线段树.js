import * as sd from "@/sd";
import { InsertBaseOn } from "../_/InsertBaseOn";
import { BuildFromSequence } from "../_/BuildFromSequence";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 4;
let tot = 0;

const initData = [0, 3, 2, 4, 1];
const operator = [
    { pos: 1, value: 1, gap: 300 },
    { pos: 2, value: 3, gap: 200 },
    { pos: 3, value: 2, gap: 100 },
    { pos: 4, value: 3, gap: 100 }
];
const trees = [];

sd.init(async () => {
    trees.push(await BuildFromSequence(initData, {
        OnNewNode: OnNewNode,
        OnTreeCreated: tree => tree.x(100).y(100).layerHeight(130),
        OnCreateValueAtLeaf: (tree, node, value) => node.childAs("v", new sd.Text(svg, `v=${value}`), R.aside("bc", 10))
    }));
})

sd.main(async () => {
    for (let i = 0; i < operator.length; i++) {
        const tree = await InsertBaseOn(trees[i], n, operator[i].pos, operator[i].value, {
            OnNewNode: OnNewNode,
            OnTreeCreated: tree => tree.x(trees[i].x() + operator[i].gap).y(100).layerHeight(130),
            OnHistoryLeftChildLink: OnHistoryLeftChildLink,
            OnHistoryRightChildLink: OnHistoryRightChildLink,
            VirtualRightChild: true,
            OnCreateValueAtLeaf: (tree, node, value) => node.childAs("v", new sd.Text(svg, `v=${value}`), R.aside("bc", 10))
        });
        trees.push(tree);
    }
})

function OnNewNode() {
    return ++tot;
}

async function OnHistoryLeftChildLink(a, b) {
    sd.Link(a, b).stroke(C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
}

async function OnHistoryRightChildLink(a, b) {
    sd.Link(a, b, sd.Curve).stroke(C.red).startAnimate().pointStoT().endAnimate().arrow();
}