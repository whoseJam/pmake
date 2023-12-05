import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let arr = sd.Array(svg).elementWidth(80).elementHeight(60);
let stk = sd.Stack(svg).resize(10);
for (let i = 1; i <= 10; i++)
    pushMathjax(arr, `Star_{${i}}`);
arr.cx(600).cy(150);
let nodes = [];
let minX = 400, maxX = 800;
let minY = 200, maxY = 500;
stk.mx(minX - 20).y(minY).height(maxY - minY);
for (let i = 0; i < 10; i++) {
    nodes.push({});
    nodes[i].x = i + 1;
    nodes[i].y = sd.rand(1, 10);
    nodes[i].circ = sd.Circle(svg).color(C.ORANGE);
    nodes[i].circ.r(10);
    put(nodes[i]);
}
nodes.sort(function(a, b) {
    return a.x - b.x;
});

main();

async function main() {
    for (let i = 0; i < 10; i++) {
        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.green);
        arr.endAnimate();
        nodes[i].circ.startAnimate().color(C.GREEN).endAnimate();

        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.white);
        arr.endAnimate();
        nodes[i].circ.startAnimate().color(C.ORANGE).endAnimate();
    }
}

function pushMathjax(a, math) {
    let m = sd.Mathjax(a).math(math).height(20);
    a.push(); let e = a.element(a.end());
    e._.valueRule = R.CenterOnly();
    e.value(m);
}

function realX(node) {
    return (node.x - 1) / 10 * (maxX - minX) + minX;
}

function realY(node) {
    return (node.y - 1) / 10 * (maxY - minY) + minY + stk.elementHeight()/2;
}

function put(node) {
    node.circ.cx(realX(node));
    node.circ.cy(realY(node));
}