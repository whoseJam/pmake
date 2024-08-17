import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.TinyGraph(svg).width(200).height(200).cx(600).cy(300);
const text = new sd.Text(svg, "S = 1111").fontSize(25).cx(graph.cx()).y(graph.my());

init();
main();

function init() {
    for (let i = 1; i <= 4; i++) {
        graph.newNode(i);
    }
    text.opacity(0);
}

async function main() {
    await eat(0b1111);
    await eat(0b1010);
    await eat(0b0101);
    await eat(0b0011);
}

async function eat(S) {
    await sd.pause();
    let str = "";
    graph.startAnimate();
    for (let i = 1; i <= 4; i++) {
        const v = (S>>i-1) & 1;
        str = v + str;
        if (v) graph.color(i, C.grey);
    }
    graph.endAnimate();
    text.text(`S = ${str}`);
    text.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    graph.startAnimate();
    for (let i = 1; i <= 4; i++)
        graph.color(i, C.white);
    graph.endAnimate();
    text.startAnimate().opacity(0).endAnimate();
}
