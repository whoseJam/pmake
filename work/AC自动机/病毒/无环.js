import * as sd from "@/sd";

import { BuildTrieTreeSync }  from "../_/BuildTrieTreeSync";
import { BuildTrieGraphSync } from "../_/BuildTrieGraphSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(90);
const focus = new sd.Focus(ac);
const data = [
    "01",
    "11", 
    "000"
];

const links1 = [
    { type: sd.Line },
    { u: 3, v: 5, type: sd.Curve, props: { bending: 0.3 } },
    { u: 7, v: 7, type: sd.CircleCurve, props: { r: 30 } },
    { u: 5, v: 5, type: sd.CircleCurve, props: { r: 30 } },
    { u: 4, v: 2, type: sd.Line, props: {} },
    { u: 3, v: 2, type: sd.Curve, props: { bending: -0.7 } },
    { u: 7, v: 3, type: sd.Curve, props: { bending: -0.3 } },
    { u: 8, v: 3, type: sd.Curve, props: { bending: -0.3 } },
    { u: 9, v: 3, type: sd.Curve, props: { bending: -0.3 } },
];

function CreateLink(links, nodeU, nodeV, u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            line.source(nodeU.center());
            if (links[i].type === sd.CircleCurve) {
                line.target(V.add(nodeV.center(), [-1, 0]));
            } else line.target(nodeV.center());
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
        OnLink: (nodeU, nodeV, u, v) => ac.element(u, v).arrow(),
        OnReachEndOfString: (nodeU) => nodeU.strokeWidth(3)
    });
    BuildTrieGraphSync(ac, "01", {
        OnLink: OnLink
    });
})

sd.main(async () => {

})

async function OnLink(nodeU, nodeV, u, v, character) {
    if (character) {
        const line = CreateLink(links1, nodeU, nodeV, u, v).arrow();
        line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
        sd.trim(line, nodeU, nodeV);
    }
}
