import * as sd from "../../../lib/slide";

const svg = sd.svg();
const graph = new sd.BipartiteGraph(svg).cx(600).cy(300);
const text = new sd.Text(svg).x(550).y(450).fontSize(25);
graph._.makeLink = (node) => {
    return new sd.Curve(node).bending(-0.3);
};
const n = 2;
main();

function init() {
    const link = (a, b) => {
        graph.link(a, b)
        graph.element(a, b).arrow();
    }
    const Y = (a) => {
        return a*2-1;
    }
    const N = (a) => {
        return a*2;
    }
    for (let i = 1; i <= n; i++) {
        graph.newNode(i*2-1, new sd.Mathjax(graph, `Y_${i}`), 0);
        graph.newNode(i*2, new sd.Mathjax(graph, `N_${i}`), 1);
        graph.element(i*2-1).rate(2.0);
        graph.element(i*2).rate(2.0);
    }
    link(N(1), Y(2));
    link(N(2), Y(1));
    text.text("Y(1) or Y(2)").cx(graph.cx());
}

async function main() {
    init();
    await sd.pause();
}