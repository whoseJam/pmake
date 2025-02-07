import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.BipartiteGraph(svg);
const n = 5;
const links = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 1],
    [4, 4],
    [4, 5],
    [5, 3],
    [5, 5],
];
let node1;
let node2;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        graph.newNode(i, 0);
        graph.newNode(i + n, i, 1);
    }
    links.forEach(link => {
        graph.link(link[0], link[1] + n);
    });
    graph.forEachNode((node, id) => {
        node.onClick(() => {
            if (id <= n) node1 = node;
            else node2 = node;
            if (node1 && node2 && graph.findLinkById(graph.nodeId(node1), graph.nodeId(node2))) {
                sd.inter(async () => {
                    graph.element(node1, node2).startAnimate().stroke(C.red).endAnimate();
                    node1.startAnimate().color(C.blue).endAnimate();
                    node2.startAnimate().color(C.blue).endAnimate();
                    node1.onClick(null);
                    node2.onClick(null);
                    node1 = undefined;
                    node2 = undefined;
                });
            }
        });
    });
});

sd.main(async () => {});
