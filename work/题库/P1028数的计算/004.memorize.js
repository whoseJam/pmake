import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let tree = sd.ValueTree(svg).x(185).y(50).width(800).layerHeight(80).drag(true).resizeable(true);
let vis = sd.Array(svg).x(320).y(300).resize(15).drag(true).resizeable(true);
let f = sd.Array(svg).x(320).y(400).resize(15).drag(true).resizeable(true);
sd.EnableArrayName(vis, "vis数组");
sd.EnableArrayName(f, "f数组");
sd.EnableArrayIndex(vis);
sd.EnableArrayIndex(f);
let v;
let n = 10;
let id;
let arrs = [];

main();

async function main() {
    id = 0;
    v = sd.make1d(20, 0);
    tree.root({ id: 1, value: makeArray(tree, [1, n], 1) });
    DfsBuild(n, 2);
    tree.opacity(0);

    id = 0; tree.opacity(1, 1);
    v = sd.make1d(20, 0);
    await DfsLook(n, 1);
}

async function DfsLook(last, dep) {
    if (v[last]) { id++; return +f.value(last).text(); }
    let ans = 1;
    let me = ++id;
    await sd.pause();
    tree.startAnimate();
    let arr = tree.element(me);
    arr.color(C.BLUE);
    tree.endAnimate();
    arrs.push(arr);
    for (let i = 1; i <= Math.floor(last/2); i++) {
        let child = id+1;
        await sd.pause();
        tree.startAnimate();
        tree.opacity(me, child, 1);
        tree.opacity(child, 1);
        tree.endAnimate();
        ans += await DfsLook(i, dep+1);
    }
    await sd.pause();
    arr.startAnimate();
    arr.color(C.ORANGE);
    arr.endAnimate();
    await sd.pause();
    f.startAnimate();
    f.value(last, sd.Text(f, ans));
    f.endAnimate();
    vis.startAnimate();
    vis.value(last, sd.Text(vis, "true"));
    vis.endAnimate();
    await sd.pause();
    arr.startAnimate();
    arr.color(C.GREY);
    arr.endAnimate();
    v[last] = 1;
    return ans;
}


function DfsBuild(last, dep) {
    if (v[last]) { id++; return; }
    let me = ++id;
    for (let i = 1; i <= Math.floor(last/2); i++) {
        let child = id+1;
        tree.link({ parent: me, id: child, value: makeArray(tree, [0, i], 1) });
        DfsBuild(i, dep+1);
    }
    v[last] = 1;
}

function makeArray(svg, arr, len) {
    let ans = sd.Array(svg);
    for (let i = 1; i <= len; i++)
        ans.push(arr[i]);
    return ans;
}