import * as sd from "@/sd";

import { BuildTrieGraph }    from "../_/BuildTrieGraph";
import { BuildTrieTreeSync } from "../_/BuildTrieTreeSync";

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

const links1 = [
    { type: sd.Line },
    { u: 2, v: 2, type: sd.CircleCurve, props: { r: 30 } },
    { u: 6, v: 6, type: sd.CircleCurve, props: { r: 30 } },
    { u: 3, v: 6, type: sd.Line, props: { dy: 3 } },
    { u: 7, v: 2, type: sd.Line, props: { dy: 3 } },
    { u: 4, v: 2, type: sd.Curve, props: { bending: -0.5 } },
    { u: 5, v: 4, type: sd.Curve, props: {} },
    { u: 9, v: 7, type: sd.Curve, props: {} },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5, dx: 3 } }

];
const links2 = [
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 6, v: 1, type: sd.Curve, props: { bending: 0.3 } },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5 } }
]

function CreateLink(links, nodeU, nodeV, u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            line.source(nodeU.center());
            line.target(nodeV.center());
            for (let key in links[i].props) {
                line[key](links[i].props[key]);
            }
            return line;
        }
    }
    return new links[0].type(svg).source(nodeU.center()).target(nodeV.center());
}

sd.init(() => {
    BuildTrieTreeSync(ac, data, {
        OnLink: (nodeU, nodeV, u, v) => {
            ac.element(u, v).arrow();
        }
    });
})

sd.main(async () => {
    await BuildTrieGraph(ac, "ab", {
        OnLink: OnLink,
        OnFocusParent: async (parent) => {
            await sd.pause();
            focus.startAnimate().focus(parent).endAnimate();
        },
        OnFocusChild: async (child) => {
            await sd.pause();
            ac.startAnimate().color(child, C.blue).endAnimate();
        },
        OnRemoveFocusChild: async (child) => {
            await sd.pause();
            ac.startAnimate().color(child, C.white).endAnimate();
        }
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

async function OnLink(nodeU, nodeV, u, v, character) {
    if (character) {
        await sd.pause();
        const length = ac.depth(nodeU.fail);
        const failChainU = CreatePath(u, length, C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        const failChainV = CreatePath(nodeU.fail, length, C.darkOrange).startAnimate().pointStoT().endAnimate().arrow();

        await sd.pause();
        const line = CreateLink(links1, nodeU, nodeV, u, v).arrow();
        line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
        sd.trim(line, nodeU, nodeV);
        line.opacity(0).startAnimate().opacity(1).endAnimate();

        await sd.pause();
        failChainU.startAnimate().opacity(0).endAnimate().remove();
        failChainV.startAnimate().opacity(0).endAnimate().remove();
    } else {
        await sd.pause();
        const line = CreateLink(links2, nodeU, nodeV, u, v).arrow();
        line.strokeDashArray([5, 5]);
        sd.trim(line, nodeU, nodeV);
        line.opacity(0).startAnimate().opacity(1).endAnimate();
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