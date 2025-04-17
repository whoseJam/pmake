import * as sd from "@/sd";

const svg = sd.svg();
const links = [
    [1, 3],
    [2, 3],
    [1, 2],
    [3, 4],
    [3, 5],
    [5, 6],
    [4, 6],
];
const g1 = build(sd.DAG, links);
const g2 = build(sd.TinyGraph, links);
const g3 = new sd.BipartiteGraph(svg).newNode(1, 0).newNode(2, 0).newNode(3, 0).newNode(4, 1).newNode(5, 1).newNode(6, 1).link(1, 4).link(2, 4).link(2, 5).link(3, 6).link(2, 6).link(1, 6).width(200).height(140);
const g4 = new sd.GridGraph(svg).width(200).height(250).n(4).width(100).height(140);
initGridGraph();

function initGridGraph() {
    const links = [
        [1, 2],
        [2, 3],
        [2, 5],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 1],
        [6, 2],
        [4, 8],
        [5, 7],
        [7, 9],
    ];
    g4.at(0, 0.33).newNode(1);
    g4.at(1, 0).newNode(2);
    g4.at(2, 0).newNode(3);
    g4.at(3, 0.33).newNode(4);
    g4.at(2, 0.66).newNode(5);
    g4.at(1, 0.66).newNode(6);
    g4.at(3, 1).newNode(7);
    g4.at(4, 0.33).newNode(8);
    g4.at(4, 1).newNode(9);
    g4.forEachNode(node => node.r(15));
    links.forEach(link => {
        g4.link(link[0], link[1]);
        g4.element(link[0], link[1]);
    });
}

g1.x(100).y(100);
g2.x(g1.mx() + 60).y(100);
g3.x(g2.mx() + 20).y(100);
g4.x(g3.mx() + 20).y(100);

function build(type, links) {
    const graph = new type(svg).width(140).height(140);
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
    return graph;
}

sd.init(() => {});

sd.main(async () => {});
