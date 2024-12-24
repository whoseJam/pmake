import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.TinyGraph(svg).width(200).height(180).cx(600).cy(300);
const text = new sd.Text(svg, "S = 111111").fontSize(25).x(graph.mx() + 20).cy(graph.ky(0.33)).opacity(0);
const math = new sd.Text(svg, "v[S] += a[i][j]").fontSize(25).x(graph.mx() + 20).cy(graph.ky(0.66)).opacity(0);
const focus1 = sd.Focus(graph);
const focus2 = sd.Focus(graph).stroke(C.deepSkyBlue);

init();
main();

function init() {
    for (let i = 1; i <= 6; i++) {
        graph.newNode(i);
    }
    text.opacity(0);
}

async function main() {
    await pack(0b101011);
}

async function pack(S) {
    await sd.pause();
    let str = "";
    graph.startAnimate();
    for (let i = 1; i <= 6; i++) {
        const v = (S>>i-1) & 1;
        str = v + str;
        if (v) graph.color(i, C.blue);
    }
    graph.endAnimate();
    text.text(`S = ${str}`);
    text.startAnimate().opacity(1).endAnimate();

    for (let i = 1; i <= 6; i++) {
        if (!((S>>i-1)&1)) continue;
        for (let j = i + 1; j <= 6; j++) {
            if (!((S>>j-1)&1)) continue;
            await sd.pause();
            focus1.startAnimate().focus(i).endAnimate();
            focus2.startAnimate().focus(j).endAnimate();
            if (math.opacity() === 0) {
                math.text(`v[S] += a[${i}][${j}]`);
                math.startAnimate().opacity(1).endAnimate();
            } else {
                math.text(`v[S] += a[${i}][${j}]`);
            }
        }
    }

    await sd.pause();
    graph.startAnimate();
    for (let i = 1; i <= 6; i++)
        graph.color(i, C.white);
    focus1.focus(null);
    focus2.focus(null);
    graph.endAnimate();
    text.startAnimate().opacity(0).endAnimate();
    math.startAnimate().opacity(0).endAnimate();
}
