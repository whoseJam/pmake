import * as sd from "@/sd";
import { BuildTrieTree }  from "../_/BuildTrieTree";
import { BuildTrieGraph } from "../_/BuildTrieGraph";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = new sd.Focus(ac);
const data = [
    "abab",
    "babb"
];


sd.init(async () => {
    await BuildTrieTree(ac, data, {
        OnLink: (nodeU, nodeV, u, v) => {
            ac.element(u, v).arrow();
        }
    }, true);
})

sd.main(async () => {
    await BuildTrieGraph(ac, "ab", {
        OnLink: OnLink,
        OnFocusParent: (parent) => {
            focus.startAnimate().focus(parent).endAnimate();
        },
        OnFocusChild: (child) => {
            ac.startAnimate().color(child, C.blue).endAnimate();
        },
        OnRemoveFocusChild: (child) => {
            ac.startAnimate().color(child, C.white).endAnimate();
        }
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

async function OnLink(nodeU, nodeV, u, v, character) {
    let pathToU, pathToV;
    if (character) {
        const length = ac.depth(nodeU.fail);
        pathToU = CreatePath(GetPath(u, length), C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        pathToV = CreatePath(GetPath(nodeU.fail, length), "#ff7300").startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        // pathToU.startAnimate().d(CreatePathD(u, length + 1)).endAnimate();
        // pathToV.startAnimate().d(CreatePathD(v, length + 1)).endAnimate();
    }

    let line;
    if (!character) {
        if (Math.abs(nodeU.cx() - nodeV.cx()) < 5 || ac.fatherId(u) == v || ac.fatherId(v) == u) line = new sd.Curve(svg);
        else line = new sd.Line(svg);
        if (u === 2) line.bending(-0.3);
        if (u === 9 && v === 6) line.bending(0.5);
        line.strokeDashArray([5, 5]);
        line.source(nodeU.center());
        line.target(nodeV.center());
    } else {
        if (u === v) line = new sd.CircleCurve(svg).r(30);
        else if (Math.abs(nodeU.cx() - nodeV.cx()) < 5 || ac.fatherId(u) == v || ac.fatherId(v) == u) line = new sd.Curve(svg);
        else line = new sd.Line(svg);
        if (u === 4 && v === 2) line.bending(-0.5);
        if (u === 9 && v === 6) {
            line.bending(0.5);
            line.source(V.add(nodeU.center(), [3, 0]));
            line.target(V.add(nodeV.center(), [3, 0]));
        } else {
            line.source(V.add(nodeU.center(), [0, 3]));
            line.target(V.add(nodeV.center(), [0, 3]));
        }
    }
    line.arrow();
    sd.trim(line, nodeU, nodeV);
    if (character) {
        line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
    }
    line.opacity(0).startAnimate().opacity(1).endAnimate();

    if (character) {
        await sd.pause();
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