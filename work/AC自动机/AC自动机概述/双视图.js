import * as sd from "@/sd";
import { BuildTrieTree } from "../_/BuildTrieTree";
import { BuildFailTree } from "../_/BuildFailTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const data = [
    "ababa",
    "babb"
];

sd.init(async () => {
    await BuildTrieTree(ac, data);
    await BuildFailTree(ac, {
        OnLink: OnLink
    }, true);
})

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    ac.forEachNodes((node, id) => {
        if (node.cx() < ac.cx()) {
            sd.Label(node, node.str, "lc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
        } else {
            sd.Label(node, node.str, "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
        }
    })

    ac.forEachNodes((node, id) => {
        node.onClick(() => {
            sd.inter(async () => {
                let f = id;
                ac.startAnimate().color(f, C.green).endAnimate();
                while (ac.element(f).fail) {
                    f = ac.element(f).fail;
                    ac.startAnimate().color(f, C.green).endAnimate();
                }
                await sd.pause();
                f = id;
                ac.startAnimate().color(f, C.white).endAnimate();
                while (ac.element(f).fail) {
                    f = ac.element(f).fail;
                    ac.startAnimate().color(f, C.white).endAnimate();
                }
            })
        })
        node.onDblClick(() => {
            sd.inter(async () => {
                let f = id;
                const path = [f];
                while (ac.fatherId(f)) {
                    f = ac.fatherId(f);
                    path.push(f);
                }
                for (let i = path.length - 1; i >= 0; i--)
                    ac.startAnimate().color(path[i], C.green).endAnimate();
                await sd.pause();
                for (let i = path.length - 1; i >= 0; i--)
                    ac.startAnimate().color(path[i], C.white).endAnimate();
            })
        })
    })
})

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