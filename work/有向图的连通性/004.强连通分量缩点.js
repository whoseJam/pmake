import * as sd from "@/sd"

let svg = sd.svg();
let C = sd.color();
let DAG = sd.TinyGraph(svg).x(100).y(100).width(800).height(400);
let outerW = 100;
let innerW = 20;
let cnt = 0;

DAG.newNode(1, makeGraph(3));
DAG.newNode(2, makeGraph(1));
DAG.newNode(3, makeGraph(4));
DAG.newNode(4, makeGraph(0));
DAG.newNode(5, makeGraph(2));
for (let i = 1; i <= 5; i++)
    DAG.element(i).width(outerW);
DAGLink(1, 5);
DAGLink(5, 2);
DAGLink(5, 3);
DAGLink(4, 5);
DAGLink(4, 3);

main();

async function main() {
    DAG.opacity(0);
    await sd.pause();
    DAG.startAnimate().opacity(1).endAnimate();
}

function DAGLink(i, j) {
    DAG.newLink(i, j);
    DAG.element(i, j).arrow().strokeWidth(2);
}

function makeGraph(idx) {
    function resize(g, n) {
        for (let i = 1; i <= n; i++)
            g.element(i).width(innerW);
    }
    function graph(n, edges) {
        let g = sd.TinyGraph(svg);
        for (let i = 1; i <= n; i++) g.newNode(i, ++cnt);
        for (let i = 0; i < edges.length; i++) {
            g.newLink(edges[i][0], edges[i][1]);
            g.element(edges[i][0], edges[i][1]).arrow();
        }
        resize(g, n);
        return g;
    }
    function node2graph() {
        let g = sd.TinyGraph(svg);
        for (let i = 1; i <= 2; i++) { g.newNode(i, ++cnt); }
        g.linkType(sd.CurveLink);
        g.newLink(1, 2); g.element(1, 2).arrow();
        g.newLink(2, 1); g.element(2, 1).arrow();
        resize(g, 2);
        return g;
    }
    let list = [
        node2graph,
        graph.bind(null, 3, [[1, 2], [2, 3], [3, 1]]),
        graph.bind(null, 3, [[1, 3], [3, 2], [2, 1]]),
        graph.bind(null, 4, [[1, 2], [2, 3], [3, 4], [4, 1], [1, 3]]),
        graph.bind(null, 6, [[1, 2], [2, 4], [4, 3], [3, 1], [2, 5], [5, 6], [6, 3]]) ];
    return list[idx]();
        // return list[sd.rand(0, list.length - 1)]();
}