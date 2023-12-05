import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let tr = sd.ValueTree(svg).x(50).y(200)
tr.width(1100).layerHeight(100)
tr.drag(true).resizeable(true);
let originArr = sd.Array(svg).x(440).y(50).start(1);
let id = 0, n = 8;
let data = [0, 1, 4, 2, 7, 5, 6, 3, 8, 9, 2];
let code = sd.Code(svg).code(`
void Build(int x,int l,int r){
    t[x].l=l;t[x].r=r;t[x].sum=0;
    if(l==r)return;
    int mid=(l+r)/2;
    Build(lc,l,mid);
    Build(rc,mid+1,r);
    t[x].sum=t[lc].sum+t[rc].sum;
}`);
let buildSeq = [], nodes = {};
let idDict = {};

pushArray(originArr, data, 1, n);

main();

function pushArray(to, arr, l, r) {
    for (let i = l; i <= r; i++) {
        to.push(arr[i]);
    }
}

async function main() {

    id = 0;
    await build(1, n, 0, 0);
    for (let i = 0; i < buildSeq.length; i++) {
        await sd.pause();
        buildSeq[i]();
    }
}

function encode(l, r) {
    return String(l) + "%%" + String(r);
}

async function build(l, r, prt, depth) {
    let a = sd.VarTable(tr).elementWidth(40);
    a.put("l", l);
    a.put("r", r);
    a.put("sum", (l === r) ? data[l] : 0);
    let myid = String(++id);
    nodes[myid] = { arr: a, l: l, r: r, depth: depth };
    idDict[encode(l, r)] = myid;
    if (prt) {
        tr.newNode(myid, a);
        tr.newLink(prt, myid);
        let node = tr.element(myid);
        node.opacity(0);
        let link = tr.element(prt, myid);
        link.opacity(0);
        buildSeq.push(function() {
            code.startAnimate().highlight(2).endAnimate();
        })
        buildSeq.push(function() {
            link.opacity(1);
            link.strokeDashOffset(link.totalLength());
            link.strokeDashArray(link.totalLength());
            link.startAnimate().strokeDashOffset(0).endAnimate();
            node.after(300).startAnimate().opacity(1).endAnimate();
        })
    }
    else {
        tr.root(myid, a);
        tr.opacity(myid, 0);
        buildSeq.push(function() {
            code.startAnimate().highlight(2).endAnimate();
        })
        buildSeq.push(function() {
            tr.startAnimate().opacity(myid, 1).endAnimate();
        });
    }
    if (l === r) {
        buildSeq.push(function() {
            code.startAnimate().highlight(3).endAnimate();
        })
        return;
    }
    buildSeq.push(function() {
        code.startAnimate().highlight(4).endAnimate();
    })
    buildSeq.push(function() {
        code.startAnimate().highlight(5).endAnimate();
    })
    let mid = Math.floor((l + r) / 2);
    await build(l, mid, myid, depth+1);
    buildSeq.push(function() {
        code.startAnimate().highlight(6).endAnimate();
    })
    await build(mid + 1, r, myid, depth+1);
    buildSeq.push(function() {
        code.startAnimate().highlight(7).endAnimate();
    })
    buildSeq.push(function() {
        let ans = 0;
        for (let i = l; i <= r; i++) ans += data[i];
        a.startAnimate().color(3, 0, C.blue).color(3, 1, C.blue).endAnimate();
        a.startAnimate().put("sum", ans).endAnimate();
        a.startAnimate().color(3, 0, C.white).color(3, 1, C.white).endAnimate();
    })
}
