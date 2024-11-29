import * as sd from "@/sd";
import { BuildTrieTree } from "../_/BuildTrieTree";
import { BuildFailTree } from "../_/BuildFailTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = sd.Focus(ac);
const failFocus = sd.Focus(ac);
const data = [
    "abab",
    "babb"
];

let pathToV;
let pathToU;

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
        OnFocusParent: (parent) => {
            focus.startAnimate().focus(parent).endAnimate();
            failFocus.focus(null).after(focus).focus(parent);
        },
        OnFocusChild: (child) => {
            ac.startAnimate().color(child, C.blue).endAnimate();
        },
        OnRemoveFocusChild: (child) => {
            ac.startAnimate().color(child, C.white).endAnimate();
        },
        OnFailJumpTo: OnFailJumpTo,
        OnFirstFailJumpTo: OnFirstFailJumpTo
    });

    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
    failFocus.startAnimate().focus(null).endAnimate();
})

function OnFailJumpTo(fail, parent) {
    failFocus.startAnimate().focus(fail).endAnimate();
    const length = ac.depth(fail);
    pathToU.startAnimate().d(CreatePathD(GetPath(parent, length))).endAnimate();
    pathToV.startAnimate().d(CreatePathD(GetPath(fail, length))).endAnimate();
}

function OnFirstFailJumpTo(fail, parent) {
    const length = ac.depth(fail);
    pathToU = CreatePath(GetPath(parent, length), C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
    pathToV = CreatePath(GetPath(fail, length), C.darkOrange).startAnimate().pointStoT().endAnimate().arrow();
}

// v is fail of u
async function OnLink(nodeU, nodeV, u, v) {
    let pathOfU, pathOfV;
    if (v !== 1) {
        const length = ac.depth(v);
        pathToU.startAnimate().d(CreatePathD(GetPath(u, length))).endAnimate();
        pathToV.startAnimate().d(CreatePathD(GetPath(v, length))).endAnimate();
        ac.startAnimate().color(v, C.orange).endAnimate();
        await sd.pause();
    }

    let type = sd.Line;
    if (nodeU.cx() == nodeV.cx() || nodeU.parentNodeId == v || nodeV.parentNodeId == u) type = sd.Curve;
    if (u === 5 && v === 7) type = sd.Curve;
    if (v === 1) type = sd.Curve;
    const l = new type(svg);
    if (type === sd.Curve) {
        if (u === 2) l.bending(-0.3);
        if (u === 6) l.bending(0.3);
    }
    l.source(nodeU.center())
    l.target(nodeV.center())
    l.arrow()
    l.strokeDashArray([5, 5])
    l.opacity(0);
    sd.trim(l, nodeU, nodeV);
    l.startAnimate().opacity(1).endAnimate();
    
    if (v !== 1) {
        await sd.pause();
        failFocus.startAnimate().focus(null).endAnimate();
        ac.startAnimate().color(v, C.white).endAnimate();
        pathToU.startAnimate().opacity(0).endAnimate().remove();
        pathToV.startAnimate().opacity(0).endAnimate().remove();
    }
}

function CreatePath(path, color = C.black) {
    return new sd.Path(svg).d(CreatePathD(path).toString()).stroke(color).strokeWidth(2).update();
}

function CreatePathD(path) {
    const pen = new sd.PathPen();
    pen.MoveTo(path[0].center());
    for (let i = 1; i < path.length; i++) {
        pen.LinkTo(path[i].center());
    }
    return pen.toString();
}

function GetPath(u, length) {
    const path = [];
    for (let i = 1; i <= length; i++) {
        path.push(ac.element(u));
        u = ac.fatherId(u);
    }
    return path.reverse();
}