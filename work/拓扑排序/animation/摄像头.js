import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.HorizontalValueTree(svg).cx(600).cy(300).layerWidth(100);
graph.height(200);

init();
main();

async function main() {
    await sd.pause();
}

function init() {
    graph.root(1, makeNode("P_{w_i}"));
    graph.newNode(2, makeNode("C_i"));
    graph.newNode(3, makeNode("P_{a}"));
    graph.newNode(4, makeNode("P_{b}"));
    graph.newNode(5, makeNode("P_{c}"));
    graph.newNode(6, makeNode("C_{j_1}"));
    graph.newNode(7, makeNode("C_{j_2}"));
    graph.newNode(8, makeNode("C_{j_3}"));
    const data = [
        [1, 2],
        [2, 3], [2, 4], [2, 5],
        [3, 6], [4, 7], [4, 8]
    ];
    data.forEach(item => {
        graph.link(item[0], item[1]);
        graph.element(item[0], item[1]).arrow();
    });
}

function makeNode(text) {
    const vertex = new sd.Vertex(graph);
    vertex.value(new sd.Mathjax(vertex, text), R.CenterFixAspect(2.0));
    return vertex;
}