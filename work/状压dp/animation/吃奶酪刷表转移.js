import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const graph = new sd.TinyGraph(svg).width(200).height(200).cx(600).cy(300);
const text = new sd.Text(svg, "S = 111111").fontSize(25).cx(graph.cx()).y(graph.my());
const focus = sd.Focus(graph);
const nextFocus = sd.Focus(graph).stroke(C.textBlue);

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        graph.newNode(i);
    }
    text.opacity(0);
}

async function main() {
    await trans(0b10101, 1);
}

async function trans(S, at) {
    await sd.pause();
    let str = "";
    graph.startAnimate();
    for (let i = 1; i <= n; i++) {
        const v = (S>>i-1) & 1;
        str = v + str;
        if (v) graph.color(i, C.grey);
    }
    focus.focus(at);
    graph.endAnimate();
    text.text(`S = ${str}`);
    text.startAnimate().opacity(1).endAnimate();

    for (let i = 1; i <= n; i++) {
        const v = (S>>i-1) & 1;
        if (!v) {
            await sd.pause();
            nextFocus.startAnimate().focus(i).endAnimate();
        }
    }

    await sd.pause();
    graph.startAnimate();
    focus.focus(null);
    nextFocus.focus(null);
    for (let i = 1; i <= n; i++)
        graph.color(i, C.white);
    graph.endAnimate();
    text.startAnimate().opacity(0).endAnimate();
}
