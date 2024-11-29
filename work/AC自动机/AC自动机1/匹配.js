import * as sd from "@/sd";
import { BuildTrieTree } from "../_/BuildTrieTree";
import { BuildFailTree } from "../_/BuildFailTree";
import { MatchOnACMachine } from "../_/MatchOnACMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(90).width(600);
const target = "abaa";
const arr = new sd.Array(svg).pushArray(target);
const data = [
    "aba",
    "ba",
    "aa",
    "bb"
];

sd.init(async () => {
    await BuildTrieTree(ac, data);
    await BuildFailTree(ac, {
        OnLink: OnLink
    }, true);

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
    await MatchOnACMachine(ac, arr);
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
