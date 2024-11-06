import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(400).height(200).cx(600).cy(300);
const data = [
    [1, 2, 12], [1, 3, 14], [1, 4, 16],
    [2, 4, 7], [2, 5, 10],
    [3, 4, 9], [3, 6, 8],
    [4, 5, 6], [4, 6, -2],
    [5, 6, 5], [5, 7, 3],
    [6, 7, 4]
];

sd.init(() => {
    function put(nodeId, locator) {
        const varList = new sd.VarList(svg);
        graph.element(nodeId).childAs("varList", varList, R.aside(locator));
        return varList;
    }
    graph.at(0.5, 0).newNode(1); put(1, "lc").put("dis", 0).put("inq", 1);
    graph.at(0, 0.25).newNode(2); put(2, "tc").put("dis", Infinity).put("inq", 0);
    graph.at(1, 0.25).newNode(3); put(3, "bc").put("dis", Infinity).put("inq", 0);
    graph.at(0.5, 0.5).newNode(4); put(4, "rc").put("dis", Infinity).put("inq", 0);
    graph.at(0, 0.75).newNode(5); put(5, "tc").put("dis", Infinity).put("inq", 0);
    graph.at(1, 0.75).newNode(6); put(6, "bc").put("dis", Infinity).put("inq", 0);
    graph.at(0.5, 1).newNode(7); put(7, "rc").put("dis", Infinity).put("inq", 0);
    data.forEach(link => {
        graph.newLink(link[0], link[1], link[2]);
    });
})

sd.main(async () => {
    await SPFA(graph);
})

async function SPFA(graph) {
    const Q = new sd.Array(svg).x(graph.x()).y(graph.my() + 100).push(1);
    const getDis = (x) => graph.element(x).child("varList").get("dis");
    const putDis = (x, dis) => graph.element(x).child("varList").put("dis", dis);
    const getInq = (x) => graph.element(x).child("varList").get("inq");
    const putInq = (x, inq) => graph.element(x).child("varList").put("inq", inq);
    const n = graph.nodes().length;
    sd.Label(Q, "队列Q");
    graph.update();
    let cnt = 0;
    while (Q.length() > 0 && ++cnt <= 20) {
        await sd.pause();
        let u = Q.firstElement().value().text();
        Q.startAnimate().color(0, C.blue).endAnimate();
        graph.startAnimate().color(u, C.blue).endAnimate();
        const outLinks = graph.outLinks(u, "direct");
        for (let link of outLinks) {
            const v = graph.toNodeId(link, u);
            if (getDis(v) > getDis(u) + link.intValue()) {
                await sd.pause();
                graph.startAnimate().color(v, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(v, getDis(u) + link.intValue());
                graph.endAnimate();
                if (!getInq(v)) {
                    await sd.pause();
                    graph.startAnimate();
                    putInq(v, 1);
                    graph.endAnimate();
                    Q.startAnimate().push(v).endAnimate();
                }
                await sd.pause();
                graph.startAnimate().color(v, C.white).endAnimate();
            }
        }
        await sd.pause();
        Q.startAnimate().erase(0).endAnimate();
        graph.startAnimate();
        graph.color(u, C.white);
        putInq(u, 0);
        graph.endAnimate();
    }
}