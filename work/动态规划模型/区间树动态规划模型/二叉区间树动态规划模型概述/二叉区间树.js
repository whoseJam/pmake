import * as sd from "@/sd";
import { buildIntervalTree } from "../_/BuildIntervalTree";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();
const n = 8;
const arr = new sd.Array(svg).resize(n).start(1);
const links = [];
const nodes = [];
let root;
let left, leftLink;
let right, rightLink;
const intervals = [
    [1, 8],
    [1, 5],
    [6, 8],
    [1, 3],
    [4, 5],
    [6, 7],
    [6, 6],
    [7, 7],
    [8, 8],
    [1, 1],
    [2, 3],
    [4, 4],
    [5, 5],
    [2, 2],
    [3, 3],
];

sd.init(() => {});

sd.main(async () => {
    await buildIntervalTree(arr, intervals, {
        onCreateNode,
        layerHeight: 30,
        initalLayerHeight: 20,
    });
    await sd.pause();
    nodes.forEach(node => node.startAnimate().opacity(0).endAnimate().remove());
    links.forEach(link => link.startAnimate().opacity(0).endAnimate().remove());
    const leftRect = new sd.Rect(left).onEnter(enter);
    left.startAnimate().childAs(leftRect, (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    const rightRect = new sd.Rect(right).onEnter(enter);
    right.startAnimate().childAs(rightRect, (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    await sd.pause();
    leftRect.startAnimate().childAs(new sd.Text(leftRect, "?").onEnter(EN.appear()), R.centerOnly()).endAnimate();
    rightRect.startAnimate().childAs(new sd.Text(rightRect, "?").onEnter(EN.appear()), R.centerOnly()).endAnimate();
    for (let i = 1; i < n; i++) {
        await sd.pause();
        left.startAnimate()
            .width((i - 1 + 1) * 40 - 10)
            .endAnimate();
        leftLink.startAnimate().target(left.pos("cx", "y")).endAnimate();
        right
            .startAnimate()
            .width((n - i) * 40 - 10)
            .mx(arr.mx() - 5)
            .endAnimate();
        rightLink.startAnimate().target(right.pos("cx", "y")).endAnimate();
    }
});

function enter(element, move) {
    element.height(0);
    element.attachTo(this.layer());
    move();
    element.startAnimate(this);
    element.height(100);
}

async function onCreateNode(l, r, fa, cx, y) {
    await sd.pause();
    const rect = new sd.Rect(svg).width((r - l + 1) * 40 - 10).height(10);
    rect.cx(cx).y(y).opacity(0).startAnimate().opacity(1).endAnimate();
    if (fa) {
        const link = new sd.Line(svg);
        link.source(fa.pos("cx", "my"));
        link.target(rect.pos("cx", "y"));
        link.startAnimate().pointStoT().endAnimate().arrow();
        if (fa === root) {
            if (l === 1) (left = rect), (leftLink = link);
            if (r === n) (right = rect), (rightLink = link);
        } else {
            links.push(link);
            nodes.push(rect);
        }
    } else {
        root = rect;
    }
    return rect;
}
