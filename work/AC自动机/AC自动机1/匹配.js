import * as sd from "@/sd";

import { BuildTrieTreeSync } from "../_/BuildTrieTreeSync";
import { BuildFailTreeSync } from "../_/BuildFailTreeSync";
import { MatchOnACMachine } from "../_/MatchOnACMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(90).width(600);
const target = "abaa";
const arr = new sd.Array(svg).pushArray(target);
const pointer = sd.Pointer(arr);
const focus = sd.Focus(ac);
const brace = sd.Brace(arr);
const data = [
    "aba",
    "ba",
    "aa",
    "bb"
];

sd.init(async () => {
    BuildTrieTreeSync(ac, data);
    BuildFailTreeSync(ac, { OnLink: OnLink });

    ac.forEachNodes((node, id) => {
        if (id === "1") return;
        if (node.cx() < ac.father(node).cx() ||
           (node.cx() === ac.father(node).cx() && node.cx() < ac.cx())) {
            sd.Label(node, node.str, "lc");
        } else {
            sd.Label(node, node.str, "rc");
        }
    })
    arr.x(ac.mx()).cy(ac.cy());

    ac.forEachNodes((node, id) => {
        let marked = false;
        node.onClick(() => {
            if (marked) return;
            sd.inter(async () => {
                node.startAnimate().color(C.green).endAnimate();
            })
        })
    })
})

sd.main(async () => {
    await MatchOnACMachine(ac, arr, {
        OnFocusNode: OnFocusNode,
        OnStartMatchAt: OnStartMatchAt,
        OnFailJumpTo: OnFailJumpTo,
        OnMatchExtended: OnMatchExtended,
        OnMatchFailed: OnMatchFailed
    });
})

async function OnFocusNode(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate().clickable(false);
}

async function OnStartMatchAt(i) {
    await sd.pause();
    pointer.startAnimate().moveTo(i).endAnimate();
}

async function OnFailJumpTo(nextFail, prevFail, i) {
    console.log("fail = ", nextFail, "cur=", prevFail, "i=", i);
    const nextLength = ac.depth(nextFail);
    const prevLength = ac.depth(prevFail);
    if (nextFail) {
        await sd.pause();
        focus.startAnimate().focus(nextFail).endAnimate();
        brace.startAnimate().brace(i - nextLength + 1, i - 1).endAnimate();
        arr.startAnimate();
        arr.color(i - prevLength + 1, i - nextLength, C.white);
        arr.color(i, C.red);
        arr.endAnimate();
    }
}

async function OnMatchExtended(u, i) {
    await sd.pause();
    const length = ac.depth(u) - 3;
    focus.startAnimate().focus(u).endAnimate();
    ac.startAnimate().color(u, C.green).endAnimate();
    brace.startAnimate().brace(i - length - 1, i).endAnimate();
    arr.startAnimate().color(i, C.green).endAnimate();

    await sd.pause();
    ac.startAnimate().color(u, C.white).endAnimate();
}

async function OnMatchFailed(u, i) {
    brace.startAnimate().opacity(0).endAnimate();
}

function OnLink(nodeU, nodeV, u, v) {
    let type = sd.Line;
    if (nodeU.cx() == nodeV.cx() || ac.fatherId(u) == v || ac.fatherId(v) == u) type = sd.Curve;
    if (u === 5 && v === 7) type = sd.Curve;
    if (v === 1) type = sd.Curve;
    const l = new type(svg);
    if (u === 5 && v === 7) l.bending(-0.3);
    if (u === 6 && v === 4) l.bending(-0.3);
    if (u === 2) l.bending(-0.3);
    if (u === 7) l.bending(0.3);
    l.source(nodeU.center());
    l.target(nodeV.center());
    l.arrow();
    l.strokeDashArray([5, 5]);
    sd.trim(l, nodeU, nodeV);
}
