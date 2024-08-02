import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).height(150).width(150);

init();
main();

function init() {
    graph.at(0, 0).newNode("a");
    graph.at(0.5, 0).newNode("b");
    graph.at(1, 0).newNode("c");
    graph.at(0.5, 1).newNode("u");
    function link(u, v) {
        graph.link(u, v);
        graph.element(u, v).arrow();
    }
    link("a", "u");
    link("b", "u");
    link("c", "u");
}

async function main() {
    await sd.pause();
    const nodes = ["a", "b", "c"];
    for (let i = 0; i < nodes.length; i++) {
        const v = graph.element(nodes[i]);
        const e = graph.element(nodes[i], "u");

        await sd.pause();
        v.startAnimate().color(C.blue).endAnimate();
        await sd.pause();
        e.startAnimate().strokeDashArray([5, 5]).stroke(C.grey).endAnimate();
        await sd.pause();
        v.startAnimate().color(C.white).endAnimate();
    }
}