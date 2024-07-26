import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const t = new sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);

init();
main();

function init() {
    t.root(1);
    link(1, 2);
    link(1, 3);
    link(2, 4);
    link(3, 5);
    link(3, 6);
    link(4, 7);
    link(4, 8);
    link(4, 9);
    link(5, 10);
    link(5, 11);
    function link(u, v) {
        t.newNode(v);
        t.newLink(u, v);
    }
}

async function main() {
    await sd.pause();
    const lines = [];
    for (let i = 1; i <= 3; i++) {
        const l = new sd.Line(svg)
            .source(t.x(), t.y() + t.layerHeight() * (i - 0.5))
            .target(t.mx(), t.y() + t.layerHeight() * (i - 0.5));
        l.stroke(C.green).strokeWidth(2);
        l.opacity(0).startAnimate().opacity(1).endAnimate();
        lines.push(l);
    }
    await sd.pause();
}