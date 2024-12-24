import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const graph = new sd.TinyGraph(svg).width(200).height(180).cx(600).cy(300);
const text = new sd.Text(svg, "S = 111111").fontSize(25).x(graph.mx() + 20).cy(graph.ky(0.33));
const nextText = new sd.Text(svg).fontSize(25).x(graph.mx() + 20).cy(graph.ky(0.66));

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        graph.newNode(i);
    }
    text.opacity(0);
    nextText.opacity(0);
}

async function main() {
    await trans(0b10011, 1);
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
    graph.endAnimate();
    text.text(`S = ${str}`);
    text.startAnimate().opacity(1).endAnimate();

    const RevS = ((1<<n)-1) ^ S;
    for (let U = RevS; U; U = (U-1) & RevS) {
        await sd.pause();
        let nextStr = "";
        graph.startAnimate();
        for (let i = 1; i <= n; i++) {
            const v = ((U|S)>>(i-1)) & 1;
            nextStr = v + nextStr;
            if (U & (1<<i-1)) {
                graph.color(i, C.blue);
            }
        }
        graph.endAnimate();
        nextText.text(`T = ${nextStr}`).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        graph.startAnimate();
        for (let i = 1; i <= n; i++) {
            if (U & (1<<i-1)) {
                graph.color(i, C.white);
            }
        }
        graph.endAnimate();
        nextText.startAnimate().opacity(0).endAnimate();
    }

    await sd.pause();
    graph.startAnimate();
    for (let i = 1; i <= n; i++)
        graph.color(i, C.white);
    graph.endAnimate();
    text.startAnimate().opacity(0).endAnimate();
}
