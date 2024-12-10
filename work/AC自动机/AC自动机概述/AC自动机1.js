import * as sd from "@/sd";

import { BuildFailTree }     from "../_/BuildFailTree";
import { BuildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = sd.Focus(ac);
const data = [
    "aba",
    "bab"
];

const links = [
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 5, v: 1, type: sd.Curve, props: { bending: 0.3} }
];

function CreateLink(u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            for (let key in links[i].props) {
                line[key](links[i].props[key]);
            }
            return line;
        }
    }
    return new links[0].type(svg);
}

sd.init(() => {
    BuildTrieTreeSync(ac, data);
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

    focus.startAnimate().focus(null).endAnimate();
})

async function OnLink(nodeU, nodeV, u, v) {
    await sd.pause();
    const line = CreateLink(u, v);
    line.source(nodeU.center());
    line.target(nodeV.center());
    line.arrow();
    line.strokeDashArray([5, 5]);
    line.opacity(0);
    sd.trim(line, nodeU, nodeV);
    line.startAnimate().opacity(1).endAnimate();
}

async function OnFocusChild(child) {
    await sd.pause();
    focus.startAnimate().focus(child).endAnimate();
}