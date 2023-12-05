import * as sd from "#lib/slide";

function indexArray(array) {
    let l = array.length();
    let start = array.start();
    for (let i = 0; i < l; i++) {
        let id = start + i;
        let txt = sd.Text(array, id).fontSize(10);
        let element = array.element(id);
        let update = () => {txt.cx(element.cx()).y(element.y() - 10); };
        array.listen("onX", update);
        array.listen("onY", update);
        array.listen("on_remove", () => { txt.remove(); });
        update();
    }
}

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
    originArr = sd.Array(svg);
    hsjPushArray(originArr, arr, 1, 8);
    originArr.cx(600).cy(350).start(1)

    for (let i = 1; i <= 8; i++)
        build(i);
}

function lowbit(x) {
    return x&(-x);
}

function mathjax(str) {
    return sd.Mathjax(svg).math(str).height(15);
}

function watch(me, target) {
    me.x(target.x()).width(target.width());
    me.y(target.y()).height(target.height());
}

function build(x) {
    let rct = sd.Box(svg).color(C.BLUE);
    rct._.valueRule = R.CenterOnly();
    rct.value(mathjax(`C_${x}`));
    let e = originArr.element(x);
    rank[x] = 1; objs[x] = rct; watch(rct, e);
    if (x % 2 === 1) { rct.dy(-e.height()-2); return; }
    for (let i = x-1; i > x-lowbit(x); i -= lowbit(i))
        rank[x] = Math.max(rank[x], rank[i]+1);
    rct.dy(-e.height()-2-rank[x]*heightY);

    let lk = sd.Link(svg);
    lk.from(rct).to(e).arrow().strokeWidth(1.2);
    for (let i = x-1; i > x-lowbit(x); i -= lowbit(i)) {
        let lk = sd.Link(svg);
        lk.from(rct).to(objs[i]).arrow().strokeWidth(1.2);
    }
}

function hsjPushArray(arr, data, l, r) {
    for (let i = l; i <= r; i++)
        arr.push(data[i]);
}