import * as sd from "@/sd";

import { buildTrieGraph } from "../_/BuildTrieGraph";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = new sd.Focus(ac);
const data = ["abab", "babb"];

const links1 = [
    // format
    { type: sd.Line },
    { u: 2, v: 2, type: sd.CircleCurve, props: { r: 30 } },
    { u: 6, v: 6, type: sd.CircleCurve, props: { r: 30 } },
    { u: 3, v: 6, type: sd.Line, props: { dy: 3 } },
    { u: 7, v: 2, type: sd.Line, props: { dy: 3 } },
    { u: 4, v: 2, type: sd.Curve, props: { bending: -0.5 } },
    { u: 5, v: 4, type: sd.Curve, props: {} },
    { u: 9, v: 7, type: sd.Curve, props: {} },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5, dx: 3 } },
];
const links2 = [
    // format
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 6, v: 1, type: sd.Curve, props: { bending: 0.3 } },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5 } },
];

function makeLink(links, du, dv, u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            line.source(du.center());
            line.target(dv.center());
            for (let key in links[i].props) {
                line[key](links[i].props[key]);
            }
            return line;
        }
    }
    return new links[0].type(svg).source(du.center()).target(dv.center());
}

sd.init(() => {
    buildTrieTreeSync(ac, data, {
        onLink: (u, v) => {
            ac.element(u, v).arrow();
        },
    });
});

sd.main(async () => {
    await buildTrieGraph(ac, "ab", {
        onLink,
        onStartBuild: async parent => {
            await sd.pause();
            focus.startAnimate().focus(parent).endAnimate();
        },
        onStartBuildChild: async child => {
            await sd.pause();
            ac.startAnimate().color(child, C.blue).endAnimate();
        },
        onEndBuildChild: async child => {
            await sd.pause();
            ac.startAnimate().color(child, C.white).endAnimate();
        },
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
});

async function onLink(u, v, character) {
    const du = ac.element(u);
    const dv = ac.element(v);
    if (character) {
        await sd.pause();
        const length = ac.depth(du.fail);
        const failChainU = makePath(u, length, C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        const failChainV = makePath(du.fail, length, C.darkOrange).startAnimate().pointStoT().endAnimate().arrow();

        await sd.pause();
        const line = makeLink(links1, du, dv, u, v).arrow();
        line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
        sd.trim(line, du, dv);
        line.opacity(0).startAnimate().opacity(1).endAnimate();

        await sd.pause();
        failChainU.startAnimate().opacity(0).endAnimate().remove();
        failChainV.startAnimate().opacity(0).endAnimate().remove();
    } else {
        await sd.pause();
        const line = makeLink(links2, du, dv, u, v).arrow();
        line.strokeDashArray([5, 5]);
        sd.trim(line, du, dv);
        line.opacity(0).startAnimate().opacity(1).endAnimate();
    }
}

function makePath(u, length, color = C.black) {
    return new sd.Path(svg).d(makePathD(u, length).toString()).stroke(color).strokeWidth(2);
}

function makePathD(u, length) {
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
