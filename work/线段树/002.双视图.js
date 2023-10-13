import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let tr1 = sd.ValueTree(svg).x(200).y(160)
    .width(923).layerHeight(50)
    .drag(true).resizeable(true);
let tr2 = sd.Tree(svg).x(200).y(350)
    .width(923).layerHeight(50)
    .drag(true).resizeable(true);
let id = 0;
let arr = [0, 1, 4, 2, 7, 5, 6, 3, 8];
let focus1 = [], focus2 = [];
let idDict = {};

main();

function pushArray(to, arr, l, r) {
    for (let i = l; i <= r; i++) {
        to.push(arr[i]);
    }
}

async function main() {
    let origin_arr = sd.Array(svg).x(100).y(100);
    pushArray(origin_arr, arr, 1, 8);
    await sd.pause();

    id = 0;
    tr1.startAnimate();
    await build1(1, 8);
    tr1.endAnimate();

    await sd.pause();

    id = 0;
    tr2.startAnimate();
    await build2(1, 8);
    tr2.endAnimate();

    let board = sd.Text(svg)
        .drag(true).resizeable(true)
        .x(20).y(300);
    while (true) {
        let l = sd.rand(1, 8);
        let r = sd.rand(1, 8);
        if (l > r) { let tmp = l; l = r; r = tmp; }
        await sd.pause();
        board.text("l=" + l + " r=" + r);
        await sd.pause();
        query(1, 8, l, r);
        console.log(focus1, focus2);
        for (let i = 0; i < focus1.length; i++) {
            focus1[i].startAnimate();
            focus1[i].color(C.red);
            focus1[i].endAnimate();
            focus2[i].startAnimate();
            focus2[i].color(C.green);
            focus2[i].endAnimate();
        }
        await sd.pause();
        for (let i = 0; i < focus1.length; i++) {
            focus1[i].startAnimate();
            focus1[i].color(C.white);
            focus1[i].endAnimate();
            focus2[i].startAnimate();
            focus2[i].color(C.white);
            focus2[i].endAnimate();
        }
        await sd.pause();
        focus1 = [];
        focus2 = [];
    }
}

function encode(l, r) {
    return String(l) + "%%" + String(r);
}

async function build1(l, r, prt) {
    let a = sd.Array(tr1);
    pushArray(a, arr, l, r);
    a.start(l);
    let myid = String(++id);
    idDict[encode(l, r)] = myid;
    if (prt) tr1.link({ parent: prt, id: myid, value: a });
    else tr1.root({ id: myid, value: a });
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build1(l, mid, myid);
    await build1(mid + 1, r, myid);
}

async function build2(l, r, prt) {
    let myid = String(++id);
    let sum = 0;
    if (l === r) {
        sum += arr[l];
        tr2.link({ parent: prt, id: myid, value: sd.Text(tr2, sum) });
        return sum;
    }

    if (prt) tr2.link({ parent: prt, id: myid });
    else tr2.root({ id: myid });

    let mid = Math.floor((l + r) / 2);
    let L = await build2(l, mid, myid);
    let R = await build2(mid + 1, r, myid);
    sum = L + R;

    let ele = tr2.element(myid);
    let txt = sd.Text(tr2, sum)
        .cx(ele.cx()).cy(ele.cy());
    ele.value(txt);

    return sum;
}

function query(l, r, ql, qr) {
    if (ql <= l && r <= qr) {
        let e1 = tr1.element(idDict[encode(l, r)]);
        let e2 = tr2.element(idDict[encode(l, r)]);
        focus1.push(e1);
        focus2.push(e2);
        return;
    }
    let mid = Math.floor((l + r) / 2);
    if (ql <= mid) query(l, mid, ql, qr);
    if (qr > mid) query(mid + 1, r, ql, qr);
}