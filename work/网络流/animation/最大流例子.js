import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).cx(600).cy(300);
const links = [
    { from: 1, to: 2, cap: 4, xloc: "mx", yloc: "my" },
    { from: 1, to: 3, cap: 2, xloc: "x", yloc: "my" },
    { from: 2, to: 3, cap: 1, xloc: "cx", yloc: "my" },
    { from: 2, to: 4, cap: 2, xloc: "mx", yloc: "cy" },
    { from: 3, to: 5, cap: 3, xloc: "x", yloc: "cy" },
    { from: 4, to: 6, cap: 3, xloc: "mx", yloc: "y" },
    { from: 5, to: 6, cap: 3, xloc: "x", yloc: "y" }
]

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.25, 0).newNode(2);
    graph.at(0.25, 1).newNode(3);
    graph.at(0.75, 0).newNode(4);
    graph.at(0.75, 1).newNode(5);
    graph.at(1, 0.5).newNode(6);
    function link(x, y) {
        graph.newLink(x, y);
    }
    links.forEach(lk => {
        link(lk.from, lk.to);
        const e = graph.element(lk.from, lk.to).arrow();
        e.value(new sd.Text(e, lk.cap).fontSize(20), R.PointAtPathByRate(0.5, lk.xloc, lk.yloc));
    });
}

async function main() {
    await sd.pause();
}