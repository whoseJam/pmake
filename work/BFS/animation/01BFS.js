import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const graph = new sd.GridGraph(svg).width(500).height(200).cx(600).cy(300);
const Q = new sd.Array(svg);
const disLoc = ["lc", "tc", "bc", "bc", "tc", "rc"];
const links = [
    [1, 2, 0],
    [1, 3, 1],
    [2, 3, 0],
    [2, 5, 0],
    [3, 4, 1],
    [4, 5, 1],
    [5, 6, 1],
    [4, 6, 0]
];

init();
main();

function init() {
    graph.at(0.5, 0).newNode(1);
    graph.at(0, 0.33).newNode(2);
    graph.at(1, 0.33).newNode(3);
    graph.at(1, 0.66).newNode(4);
    graph.at(0, 0.66).newNode(5);
    graph.at(0.5, 1).newNode(6);
    function addLink(u, v, w) {
        graph.newLink(u, v);
        graph.element(u, v).value(w);
    }
    links.forEach(link => {
        addLink(link[0], link[1], link[2]);
    });
    sd.Label(Q, "队列Q", "lc");
    Q.x(graph.x()).y(graph.my() + 60).push(1);
    for (let i = 1; i <= 6; i++) {
        const text = (i === 1) ? "dis=0" : "dis=inf"; 
        const label = sd.Label(graph.element(i), text, disLoc[i-1]);
        graph.element(i).label = label;
    }
    graph.element(1).dis = 0;
}

async function main() {
    while (Q.length()) {
        await sd.pause();
        const u = Q.intValue(0);
        const nodeU = graph.element(u);
        Q.startAnimate().color(0, C.blue).endAnimate();
        graph.startAnimate().color(u, C.blue).endAnimate();

        const to = graph.outLinks(u, "undirected");
        for (let i = 0; i < to.length; i++) {
            const v = graph.toNodeId(u, to[i]);
            const w = to[i].intValue();
            const nodeV = graph.element(v);
            if (nodeV.label.text() == "dis=inf") {
                await sd.pause();
                nodeV.label.startAnimate().opacity(0).endAnimate()
                .text(`dis=${nodeV.dis = nodeU.dis + w}`)
                .startAnimate().opacity(1).endAnimate();
                if (w === 0) {
                    await sd.pause();
                    Q.startAnimate().insert(1, v).endAnimate();
                } else {
                    await sd.pause();
                    Q.startAnimate().push(v).endAnimate();
                }
            }
        }
        await sd.pause();
        Q.startAnimate().erase(0).endAnimate();
        graph.startAnimate().color(u, C.white).endAnimate();
    }
}