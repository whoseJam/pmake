import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let n = 8;
let tr = sd.ValueTree(svg).x(50).y(200)
tr.width(1100).layerHeight(100)
tr.drag(true).resizeable(true);
let originArr = sd.Array(svg).x(440).y(50).start(1).resize(n).indexed(true);
let id = 0, nodes = {};

main();


async function main() {

    id = 0;
    await build(1, 1, n, 0);

    await query(2, 6);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (j - i <= 2) continue;
            await query(i, j, true);
        }
    }
}

async function query(l, r, brief = false) {
    await sd.pause();
    originArr.startAnimate();
    for (let i = l; i <= r; i++)
        originArr.color(i, C.orange);
    originArr.endAnimate();
    let segments = [];
    function myquery(x, L, R) {
        if (l <= L && R <= r) {
            segments.push(x);
            return;
        }
        let mid = Math.floor((L + R) / 2);
        if (l <= mid) myquery(x*2, L, mid);
        if (r > mid) myquery(x*2+1, mid + 1, R);
    }
    myquery(1, 1, n);

    let grad = C.gradient(C.white, C.orange, 0, segments.length + 1);
    if (!brief) await sd.pause();
    originArr.startAnimate();
    for (let i = 0; i < segments.length; i++) {
        let l = nodes[segments[i]].l;
        let r = nodes[segments[i]].r;
        nodes[segments[i]].rct = sd.Rect(svg)
            .x(originArr.element(l).x()).width(originArr.elementWidth() * (r - l + 1))
            .y(originArr.element(l).y()).height(originArr.elementHeight())
            .fillOpacity(0).strokeWidth(3).stroke(C.red).opacity(0)
            .startAnimate().opacity(1).endAnimate();
        for (let j = l; j <= nodes[segments[i]].r; j++)
            originArr.color(j, grad(i + 1));
    }
    originArr.endAnimate();

    if (!brief) await sd.pause();
    for (let i = 0; i < segments.length; i++) {
        let elem = nodes[segments[i]].elem;
        let rct = nodes[segments[i]].rct;
        elem.startAnimate().color(grad(i + 1)).endAnimate();
        rct.startAnimate();
        rct.x(elem.x()).width(elem.width());
        rct.y(elem.y()).height(elem.height())
        rct.endAnimate();
    }
    await sd.pause();
    originArr.startAnimate().color(C.white).endAnimate();
    for (let i = 0; i < segments.length; i++) {
        nodes[segments[i]].elem.startAnimate().color(C.white).endAnimate();
        let rct = nodes[segments[i]].rct;
        rct.startAnimate().opacity(0).remove();
    }
}

async function build(x, l, r, prt) {
    let e = sd.Rect(svg).width(80).height(50);
    let a = sd.Text(svg, `[${l}, ${r}]`).fontSize(25);
    e.children.push(a, R.CenterOnly());
    nodes[x] = { l: l, r: r, elem: e };
    if (prt) tr.newNode(x, e).newLink(prt, x);
    else tr.root(x, e);
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build(x*2, l, mid, x);
    await build(x*2+1, mid + 1, r, x);
}
