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

    await add(2, 6);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (j - i <= 2) continue;
            await add(i, j, true);
        }
    }
}

function linkTo(a, b, time) {
    let link = sd.Link(svg).from(a).to(b);
    let t = link.totalLength();
    link.strokeDashOffset(t);
    link.strokeDashArray(t);
    link.after(time);
    link.startAnimate().strokeDashOffset(0).endAnimate();
    link.arrow().strokeDashOffset(2*t);
    link.startAnimate().strokeDashOffset(t).endAnimate();
    link.remove();
}

async function add(l, r) {
    let T = 0;
    async function pushTag(x, tag, time) {
        if (!nodes[x]) return;
        if (!nodes[x].tag) {
            nodes[x].tag = sd.Circle(svg).r(10).color(C.ORANGE);
            nodes[x].tag.cx(nodes[x].elem.cx());
            nodes[x].tag.my(nodes[x].elem.y() - 5);
            nodes[x].tag.opacity(0).startAnimate().opacity(1).endAnimate();
            if (tag) linkTo(tag, nodes[x].tag, time);
            else nodes[x].tag.startAnimate().color(C.RED).endAnimate().startAnimate().color(C.ORANGE).endAnimate();
        } else {
            if (tag) linkTo(tag, nodes[x].tag, time);
            else nodes[x].tag.startAnimate().color(C.RED).endAnimate().startAnimate().color(C.ORANGE).endAnimate();
        }
    }
    async function pushDown(x) {
        if (nodes[x].tag) {
            let time = nodes[x].tag.delay();
            await pushTag(x*2, nodes[x].tag, time);
            await pushTag(x*2+1, nodes[x].tag, time);
            nodes[x].tag.after(600).startAnimate().opacity(0).remove();
            nodes[x].tag = null;
        }
    }
    async function Add(x, l, r) {
        await sd.pause();
        nodes[x].elem.startAnimate().color(C.blue).endAnimate();
        if (l <= nodes[x].l && nodes[x].r <= r) {
            await pushTag(x);
            await sd.pause();
            nodes[x].elem.startAnimate().color(C.white).endAnimate();
            return;
        }
        let mid = (nodes[x].l + nodes[x].r)>>1;
        await pushDown(x);
        if (l <= mid) await Add(x*2, l, r);
        if (r > mid) await Add(x*2+1, l, r);
        await sd.pause();
        nodes[x].elem.startAnimate().color(C.white).endAnimate();
    }
    await sd.pause();
    originArr.startAnimate();
    for (let i = l; i <= r; i++) originArr.color(i, C.blue);
    originArr.endAnimate(); 
    await Add(1, l, r);
    await sd.pause();
    originArr.startAnimate();
    for (let i = l; i <= r; i++) originArr.color(i, C.white);
    originArr.endAnimate(); 
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
