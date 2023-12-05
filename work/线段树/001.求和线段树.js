import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let tr = sd.ValueTree(svg).x(50).y(200)
tr.width(1100).layerHeight(100)
tr.drag(true).resizeable(true);
let originArr = sd.Array(svg).x(440).y(50).start(1);
let id = 0, n = 8;
let data = [0, 1, 4, 2, 7, 5, 6, 3, 8];
let buildSeq = [], nodes = {};
let focus1 = [], focus2 = [];
let idDict = {};

pushArray(originArr, data, 1, n);

main();

function pushArray(to, arr, l, r) {
    for (let i = l; i <= r; i++) {
        to.push(arr[i]);
    }
}

function animateGroup() {
    let self = {};
    let seq = [];
    for (let i = 0; i < arguments.length; i++)
        seq.push(arguments[i]);
    self.start = async function() {
        await sd.pause();
        for (let i = 0; i < seq.length; i++) seq[i]();
    }
    self.push = function(na) { seq.push(na); }
    return self;
}

async function main() {

    id = 0;
    await build(1, n, 0, 0);
    for (let i = 0; i < buildSeq.length; i++)
        await buildSeq[i].start();
    for (let i = 3; i >= 0; i--)
        await merge(i);

    await query(2, 6);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (j - i <= 2) continue;
            await query(i, j, true);
        }
    }
}

function encode(l, r) {
    return String(l) + "%%" + String(r);
}

async function query(l, r, brief = false) {
    await sd.pause();
    originArr.startAnimate();
    for (let i = l; i <= r; i++)
        originArr.color(i, C.orange);
    originArr.endAnimate();
    let segments = [];
    function myquery(L, R) {
        if (l <= L && R <= r) {
            segments.push(idDict[encode(L, R)]);
            return;
        }
        let mid = Math.floor((L + R) / 2);
        if (l <= mid) myquery(L, mid);
        if (r > mid) myquery(mid + 1, R);
    }
    myquery(1, n);

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
        let arr = nodes[segments[i]].arr;
        nodes[segments[i]].arr.startAnimate().color(grad(i + 1)).endAnimate();
        nodes[segments[i]].rct.startAnimate().x(arr.x()).y(arr.y()).endAnimate();
    }
    await sd.pause();
    originArr.startAnimate().color(C.white).endAnimate();
    for (let i = 0; i < segments.length; i++) {
        nodes[segments[i]].arr.startAnimate().color(C.white).endAnimate();
        let rct = nodes[segments[i]].rct;
        rct.startAnimate().opacity(0).remove();
    }
}

async function merge(depth) {
    await sd.pause();
    for (let id in nodes) {
        if (nodes[id].depth !== depth) continue;
        let arr = nodes[id].arr;
        arr.startAnimate().color(C.BLUE).endAnimate();
        let table = sd.Text(arr);
        arr.children.push("table", table, function(parent, child) {
            if (nodes[id].l === nodes[id].r) {
                child.cx(parent.cx());
                child.y(parent.my() + 3);
            } else {
                child.mx(parent.x() - 10);
                child.cy(parent.cy());
            }
        })
        let sum = 0;
        for (let i = nodes[id].l; i <= nodes[id].r; i++)
            sum += data[i];
        table.opacity(0).text(`sum=${sum}`).after(arr).startAnimate().opacity(1).endAnimate();
    }
    await sd.pause();
    for (let id in nodes) {
        if (nodes[id].depth !== depth) continue;
        let arr = nodes[id].arr;
        arr.startAnimate().color(C.DEFAULT).endAnimate();
    }
}

async function build(l, r, prt, depth) {
    if (buildSeq.length === depth)
        buildSeq.push(animateGroup());
    let a = sd.Array(tr).start(l);
    pushArray(a, data, l, r);
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
        buildSeq[depth].push(function() {
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
        buildSeq[depth].push(function() {
            tr.startAnimate().opacity(myid, 1).endAnimate();
        });
    }
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build(l, mid, myid, depth+1);
    await build(mid + 1, r, myid, depth+1);
}
