import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let startX = 200, endX = 1000;
let startY = 200, heightY = 60;
let id = 0;
let arr = [0, 1, 4, 2, 7, 5, 6, 3, 8];
let rank = sd.make1d(10);
let objs = sd.make1d(10);
let originArr;

main();

async function main() {
    originArr = new sd.Array(svg).start(1);
    for (let i = 1; i <= 8; i++) {
        originArr.push(null);
        originArr.element(i)._.valueRule = R.CenterOnly();
        originArr.value(i, mathjax(`A_${i}`));
    }
    originArr.cx(600).cy(350)

    for (let i = 1; i <= 8; i++)
        build(i);
    await sd.pause();
}

function lowbit(x) {
    return x&(-x);
}

function mathjax(str) {
    return new sd.Mathjax(svg).math(str).height(15);
}

function watch(me, target) {
    me.x(target.x()).width(target.width());
    me.y(target.y()).height(target.height());
}

function build(x) {
    let rct = new sd.Box(svg).color(C.BLUE);
    rct._.valueRule = R.CenterOnly();
    rct.value(mathjax(`C_${x}`));
    let e = originArr.element(x);
    rank[x] = 1; objs[x] = rct; watch(rct, e);
    if (x % 2 === 1) { rct.dy(-e.height()-2); return; }
    for (let i = x-1; i > x-lowbit(x); i -= lowbit(i))
        rank[x] = Math.max(rank[x], rank[i]+1);
    rct.dy(-e.height()-2-rank[x]*heightY);

    let lk = sd.Link(rct, e);
    lk.arrow().strokeWidth(1.2);
    for (let i = x-1; i > x-lowbit(x); i -= lowbit(i)) {
        let lk = sd.Link(rct, objs[i]);
        lk.arrow().strokeWidth(1.2);
    }
}

function hsjPushArray(arr, data, l, r) {
    for (let i = l; i <= r; i++)
        arr.push(data[i]);
}