import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).elementWidth(80).elementHeight(60);
const stk = new sd.Stack(svg).resize(10);
const graph = new sd.GridGraph(svg);
const data = [];

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Mathjax(arr, `Star_{${i}}`));
        stk.element(i-1).childAs("impact", new sd.Array(stk).elementWidth(10).elementHeight(10), R.Aside("rc", 10));
    }
    stk.add = function(x) {
        const impact = this.element(x).child("impact");
        impact.push().color(impact.end(), C.BLUE);
        return this;
    }
    arr.cx(600).cy(150);
    stk.mx(arr.x() - 60).y(arr.my());
    graph.x(arr.x()).y(arr.my());
    graph.width(arr.width()).height(stk.height());
    graph.n(n).m(n);
    for (let i = 0; i < n; i++) {
        const x = i;
        const y = sd.rand(0, n-1);
        graph.at(y+0.5, x+0.5).newNode(i + 1, " ");
        graph.element(i + 1).color(C.ORANGE).r(15);
        data.push({
            x: x,
            y: y,
            circ: graph.element(i + 1)
        });
    }
    graph.update();
}

async function main() {
    const focus = sd.Focus(stk);
    for (let i = 0; i < 10; i++) {
        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.green);
        arr.endAnimate();
        data[i].circ.startAnimate().color(C.GREEN).endAnimate();

        await sd.pause();
        focus.startAnimate().focus(data[i].y, n-1).endAnimate();

        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();

        await sd.pause();
        stk.startAnimate().add(data[i].y).endAnimate();

        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.white);
        arr.endAnimate();
        data[i].circ.startAnimate().color(C.ORANGE).endAnimate();
    }
}