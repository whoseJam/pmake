import * as sd from "#lib/slide";

let svg = sd.svg();

let tr = sd.ValueTree(svg).x(200).y(100)
    .width(923).layerHeight(70)
    .drag(true).resizeable(true);
let id = 0;
let arr = [0, 1, 4, 2, 7, 5, 6, 3, 8];

main();

function pushArray(to, arr, l, r) {
    for (let i = l; i <= r; i++) {
        to.push(arr[i]);
    }
}

async function main() {
    let origin_arr = sd.Array(svg);
    pushArray(origin_arr, arr, 1, 8);
    origin_arr.x(100).y(100);
    await sd.pause();

    tr.startAnimate();
    id = 0;
    await build(1, 8);
    tr.endAnimate();

    id = 0;
    await rebuild(1, 8);
}

async function build(l, r, prt) {
    let a = sd.Array(tr).start(l);
    pushArray(a, arr, l, r);
    let myid = String(++id);
    if (prt) tr.link({ parent: prt, id: myid, value: a });
    else tr.root({ id: myid, value: a });
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build(l, mid, myid);
    await build(mid + 1, r, myid);
}

function switchValue(id, val) {
    let cx = tr.element(id).cx();
    let cy = tr.element(id).cy();
    let ar = tr.element(id);
    ar.startAnimate();
    ar.push(val);
    while (ar.length() > 1)
        ar.erase(ar.start());
    ar.cx(cx).cy(cy);
    ar.endAnimate();
    tr.update();
}

async function rebuild(l, r) {
    let myid = String(++id);
    let sum = 0;
    if (l === r) {
        sum += arr[l];
        await sd.pause();
        switchValue(myid, sd.Text(svg, sum));
        return sum;
    }

    let mid = Math.floor((l + r) / 2);
    let L = await rebuild(l, mid);
    let R = await rebuild(mid + 1, r);
    sum = L + R;

    await sd.pause();
    switchValue(myid, sd.Text(svg, sum));
    return sum;
}