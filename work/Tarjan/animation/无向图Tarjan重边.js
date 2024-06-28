import * as sd from "@/SD";

const svg = sd.svg();
const graph1 = new sd.GridGraph(svg);
const graph2 = new sd.GridGraph(svg).x(300);

init();
main();

function init() {
    function initGraph1(graph) {
        graph.at(0, 0.5).newNode("u");
        graph.at(1, 0.5).newNode("v");

        const euv = sd.Link(graph.element("u"), graph.element("v"), sd.Curve);
        euv.bending(0.6).arrow();
        const evu = sd.Link(graph.element("v"), graph.element("u"), sd.Curve);
        evu.bending(0.3).arrow();

        const Euv = sd.Link(graph.element("u"), graph.element("v"), sd.Curve);
        Euv.bending(-0.6).arrow();
        const Evu = sd.Link(graph.element("v"), graph.element("u"), sd.Curve);
        Evu.bending(-0.3).arrow();
    }
    function initGraph2(graph) {
        graph.at(0, 0.5).newNode("u");
        graph.at(1, 0.5).newNode("v");

        const euv = sd.Link(graph.element("u"), graph.element("v"), sd.Curve);
        euv.bending(0.3).arrow();
        const evu = sd.Link(graph.element("v"), graph.element("u"), sd.Curve);
        evu.bending(0.3).arrow();
    }
    initGraph1(graph1);
    initGraph2(graph2);
}

async function main() {
    await sd.pause();
}