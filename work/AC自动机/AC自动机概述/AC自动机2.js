import * as sd from "@/sd";

import { BuildTrieTreeSync } from "../_/BuildTrieTreeSync";
import { BuildFailTree }     from "../_/BuildFailTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const parentFocus = sd.Focus(ac);
const failFocus = sd.Focus(ac);
const data = [
    "abab",
    "babb"
];

let failChainU;
let failChainV;

const links = [
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 6, v: 1, type: sd.Curve, props: { bending: 0.3 } },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.3 } },
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
        OnFocusParent: async (parent) => {
            await sd.pause();
            parentFocus.startAnimate().focus(parent).endAnimate();
            failFocus.focus(null).after(parentFocus).focus(parent);
        },
        OnFocusChild: async (child) => {
            await sd.pause();
            ac.startAnimate().color(child, C.blue).endAnimate();
        },
        OnRemoveFocusChild: async (child) => {
            await sd.pause();
            ac.startAnimate().color(child, C.white).endAnimate();
        },
        OnFailJumpTo: OnFailJumpTo
    });

    await sd.pause();
    parentFocus.startAnimate().focus(null).endAnimate();
    failFocus.startAnimate().focus(null).endAnimate();
})

async function OnFailJumpTo(fail, parent, first) {
    await sd.pause();
    const length = ac.depth(fail);
    failFocus.startAnimate().focus(fail).endAnimate();
    if (first) {
        failChainU = CreatePath(parent, length, C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        failChainV = CreatePath(fail, length, C.darkOrange).startAnimate().pointStoT().endAnimate().arrow();
    } else {
        failChainU.startAnimate().d(CreatePathD(parent, length)).endAnimate();
        failChainV.startAnimate().d(CreatePathD(fail, length)).endAnimate();
    }
}

async function OnLink(nodeU, nodeV, u, v) {
    if (v != 1) {
        await sd.pause();
        const length = ac.depth(v);
        failChainU.startAnimate().d(CreatePathD(u, length)).endAnimate();
        failChainV.startAnimate().d(CreatePathD(v, length)).endAnimate();
        ac.startAnimate().color(v, C.orange).endAnimate();
    }

    await sd.pause();
    const line = CreateLink(u, v);
    line.source(nodeU.center());
    line.target(nodeV.center());
    line.arrow();
    line.strokeDashArray([5, 5]);
    line.opacity(0);
    sd.trim(line, nodeU, nodeV);
    line.startAnimate().opacity(1).endAnimate();

    if (v != 1) {
        await sd.pause();
        failFocus.startAnimate().focus(null).endAnimate();
        ac.startAnimate().color(v, C.white).endAnimate();
        failChainU.startAnimate().opacity(0).endAnimate().remove();
        failChainV.startAnimate().opacity(0).endAnimate().remove();
    }
}

function CreatePath(u, length, color = C.black) {
    return new sd.Path(svg).d(CreatePathD(u, length).toString()).stroke(color).strokeWidth(2).update();
}

function CreatePathD(u, length) {
    function GetPath(u, length) {
        const path = [];
        for (let i = 1; i <= length; i++) {
            path.push(ac.element(u));
            u = ac.fatherId(u);
        }
        return path.reverse();
    }
    const path = GetPath(u, length);
    const pen = new sd.PathPen();
    pen.MoveTo(path[0].center());
    for (let i = 1; i < path.length; i++) {
        pen.LinkTo(path[i].center());
    }
    return pen.toString();
}