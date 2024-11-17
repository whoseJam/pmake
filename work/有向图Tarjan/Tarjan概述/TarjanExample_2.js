import * as sd from "@/sd";
import { Tarjan } from "./Tarjan";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(300).height(150).m(2);
const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const n = 6;
const links = [
    [1, 2],
    [2, 3],
    [2, 5],
    [4, 1],
    [5, 4],
    [5, 6],
    [6, 3]
];

sd.init(() => {
    graph.at(0, 0).newNode(1);
    graph.at(0, 1).newNode(2);
    graph.at(0, 2).newNode(3);
    graph.at(1, 0).newNode(4);
    graph.at(1, 1).newNode(5);
    graph.at(1, 2).newNode(6);
    links.forEach(link => {
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
    stack.y(graph.element(1).y());
})

sd.main(async () => {
    await sd.pause();
    await Tarjan(n, stack, Element, ToNodes, {
        OnTraceBack: OnTraceBack
    });
})

function Element(u) {
    return graph.element(u);
}

function ToNodes(u) {
    const children = graph.outNodes(u).map(node => {
        return {
            id: graph.nodeId(node),
            link: graph.element(u, graph.nodeId(node)),
            node: node
        };
    });
    return [...children];
}

function OnTraceBack(source, target, u, v) {
    if ((u == 4 && v == 1) ||
        (u == 2 && v == 1)) {
        return sd.Link(source, target, sd.Curve);
    }
    return sd.Link(source, target);
}