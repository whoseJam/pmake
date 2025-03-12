import * as sd from "@/sd";
import { Tarjan } from "./Tarjan";

const svg = sd.svg();
const tree = new sd.Tree(svg).width(500);
const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const n = 9;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [5, 8],
    [5, 9],
];
const externLinks = [
    [8, 2, sd.Line, {}],
    [5, 1, sd.Line, {}],
    [7, 6, sd.Line, {}],
    [6, 3, sd.Curve, {}],
];

sd.init(() => {
    tree.root(1);
    for (let i = 2; i <= n; i++) tree.newNode(i);
    links.forEach(link => {
        tree.newLink(link[0], link[1]);
        tree.element(link[0], link[1]).arrow();
    });
    externLinks.forEach(link => {
        link[3].link = sd.Link(tree.element(link[0]), tree.element(link[1]), link[2]).arrow();
        link[3].link.clazz = link[2];
    });
});

sd.main(async () => {
    await sd.pause();
    await Tarjan(n, stack, Element, ToNodes, {
        OnTraceBack: OnTraceBack,
    });
});

function Element(u) {
    return tree.element(u);
}

function ToNodes(u) {
    const children = tree.children(u).map(node => {
        return {
            id: tree.nodeId(node),
            link: tree.element(u, tree.nodeId(node)),
            node: node,
        };
    });
    const extern = externLinks
        .filter(link => String(link[0]) === u)
        .map(link => {
            return {
                id: String(link[1]),
                link: link[3].link,
                node: tree.element(link[1]),
            };
        });
    return [...children, ...extern];
}

function OnTraceBack(source, target, u, v) {
    return sd.Link(source, target, sd.Curve);
}
