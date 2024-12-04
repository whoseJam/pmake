import * as sd from "@/sd";
import { InsertBaseOn } from "../_/InsertBaseOn";
import { BuildFromSequence } from "../_/BuildFromSequence";

const svg = sd.svg();
const C = sd.color();
let tot = 0;

sd.init(() => {
    
})

sd.main(async () => {
    const t0 = await BuildFromSequence([0, 1, 2, 3, 4], {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(100).y(100).layerHeight(130)
    })
    const t1 = await InsertBaseOn(t0, 4, 1, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(400).y(100).layerHeight(130),
        OnHistoryLeftChildLink: OnHistoryLeftChildLink,
        OnHistoryRightChildLink: OnHistoryRightChildLink,
        VirtualRightChild: true
    });
    const t2 = await InsertBaseOn(t1, 4, 2, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(600).y(100).layerHeight(130),
        OnHistoryLeftChildLink: OnHistoryLeftChildLink,
        OnHistoryRightChildLink: OnHistoryRightChildLink,
        VirtualRightChild: true
    });
    const t3 = await InsertBaseOn(t2, 4, 3, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(700).y(100).layerHeight(130),
        OnHistoryLeftChildLink: OnHistoryLeftChildLink,
        OnHistoryRightChildLink: OnHistoryRightChildLink,
        VirtualRightChild: true
    });
    const t4 = await InsertBaseOn(t3, 4, 4, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(800).y(100).layerHeight(130),
        OnHistoryLeftChildLink: OnHistoryLeftChildLink,
        OnHistoryRightChildLink: OnHistoryRightChildLink,
        VirtualRightChild: true
    });
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