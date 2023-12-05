import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let tr = sd.ValueTree(svg).x(50).y(200)
tr.width(1100).layerHeight(100)
tr.drag(true).resizeable(true);
let originArr = sd.Array(svg).x(440).y(50).start(1);
let n = 8;
let board = sd.Text(svg).fontSize(30).x(800).y(50);
let data = [0, 1, 4, 2, 7, 5, 6, 3, 8, 9, 2];
let code = sd.Code(svg).code(`
void Update(int x,int pos,int d){
    if(t[x].l==t[x].r){
        t[x].mn=d;
        return;
    }
    int mid=(t[x].l+t[x].r)/2;
    if(pos<=mid)Update(lc,pos,d);
    else Update(rc,pos,d);
    t[x].mn=min(t[lc].mn,t[rc].mn);
}
`);
let nodes = {};

main();

async function main() {
    id = 0;
    await build(1, 1, n, 0);
    board.text("Update Position=5")
    await update(1, 5);
    while (true) {
        await sd.pause();
        let pos = sd.rand(1, n);
        board.text(`Update Position=${pos}`)
        await update(1, pos);
    }
}

async function update(x, pos) {
    await sd.pause();
    code.startAnimate().highlight(1).endAnimate();
    tr.startAnimate().color(x, C.red).endAnimate();
    if (nodes[x].l==nodes[x].r) {
        await sd.pause();
        code.startAnimate().highlight(2, 5).endAnimate();
        await sd.pause();
        tr.startAnimate().color(x, C.white).endAnimate();
        return;
    }
    await sd.pause();
    code.startAnimate().highlight(6).endAnimate();
    let mid = (nodes[x].l + nodes[x].r)>>1;
    if (pos <= mid) {
        await sd.pause();
        code.startAnimate().highlight(7).endAnimate();
        await update(x*2, pos);
    }
    else {
        await sd.pause();
        code.startAnimate().highlight(8).endAnimate();
        await update(x*2+1, pos);
    }
    await sd.pause();
    code.startAnimate().highlight(9).endAnimate();
    await sd.pause();
    tr.startAnimate().color(x, C.white).endAnimate();
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
