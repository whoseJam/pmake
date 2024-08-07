import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(100).height(100).cx(600).cy(300);
const text = new sd.Text(svg).x(550).y(450).fontSize(25);
main();

function init() {
    const link = (a, b) => {
        graph.link(a, b)
        graph.element(a, b).arrow();
    }
    graph.at(0, 0).newNode(1, new sd.Mathjax(graph, "Y_i"), 0);
    graph.at(1, 0).newNode(2, new sd.Mathjax(graph, "N_i"), 1);
    graph.at(0, 1).newNode(3, new sd.Mathjax(graph, "Y_j"), 0);
    graph.at(1, 1).newNode(4, new sd.Mathjax(graph, "N_j"), 1);
    for (let i = 1; i <= 4; i++)
        graph.element(i).rate(2);
    link(2, 4);
    text.text("i取N，则j必须取N").cx(graph.cx());
}

async function main() {
    init();
    await sd.pause();
}