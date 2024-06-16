import * as sd from "@/slide";
import { flow } from "./网络流动画库";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).cx(600).cy(300);
const R = sd.rule();
const links = [
    { from: 1, to: 2, cap: 99, xloc: "mx", yloc: "my" },
    { from: 1, to: 3, cap: 99, xloc: "mx", yloc: "y" },
    { from: 2, to: 3, cap: 1, xloc: "x", yloc: "cy" },
    { from: 2, to: 4, cap: 99, xloc: "x", yloc: "my" },
    { from: 3, to: 4, cap: 99, xloc: "x", yloc: "y" }
];

init();
main();

function init() {
    graph.at(0.5, 0).newNode(1);
    graph.at(0, 0.5).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0.5, 1).newNode(4);
    function link(x, y) {
        graph.newLink(x, y);
    }
    links.forEach(lk => {
        link(lk.from, lk.to);
        const e = graph.element(lk.from, lk.to).arrow();
        e.value(new sd.Text(e, lk.cap).fontSize(20), R.PointAtPathByRate(0.5, lk.xloc, lk.yloc));
        e.xloc = lk.xloc;
        e.yloc = lk.yloc;
    });
    graph._.linkType = sd.Curve;
}

async function main() {
    for (let i = 1; i <= 3; i++) {
        await flow(graph, [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 }
        ]);
        await flow(graph, [
            { from: 1, to: 3 },
            { from: 3, to: 2 },
            { from: 2, to: 4}
        ]);
    }
    await sd.pause();
}
