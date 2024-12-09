import * as sd from "@/sd";
import { BuildTrieTree } from "../_/BuildTrieTree";
import { BuildFailTree } from "../_/BuildFailTree";

const svg = sd.svg();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = sd.Focus(ac);
const data = [
    "aba",
    "bab"
];

sd.init(async () => {
    await BuildTrieTree(ac, data);
})

sd.main(async () => {
    await sd.pause();
    ac.forEachNodes((node, idx) => {
        if (idx === "1") return;
        sd.Label(node, node.str, node.cx() < ac.root().cx() ? "lc" : "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    });

    await BuildFailTree(ac, {
        OnLink: OnLink,
        OnFocusChild: OnFocusChild
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

async function OnLink(nodeU, nodeV, u, v) {
    await sd.pause();
    let type = sd.Line;
    if (v === 1) type = sd.Curve;
    const l = new type(svg);
    if (v === 1) l.bending(-0.3);
    if (u === 5) l.bending(0.3);
    l.source(nodeU.center());
    l.target(nodeV.center());
    l.arrow();
    l.strokeDashArray([5, 5]);
    l.opacity(0);
    sd.trim(l, nodeU, nodeV);
    l.startAnimate().opacity(1).endAnimate();
    return l;
}

async function OnFocusChild(child) {
    await sd.pause();
    focus.startAnimate().focus(child).endAnimate();
}