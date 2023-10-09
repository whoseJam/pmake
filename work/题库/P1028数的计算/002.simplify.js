import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let tree = sd.ValueTree(svg).x(185).y(50).width(800).layerHeight(80).drag(true).resizeable(true);
let p = sd.make1d(10, 0);
let n = 10;
let id;
let arrs = [];

main();

async function main() {
    p[1] = n; id = 0;
    tree.root({ id: 1, value: makeArray(tree, p, 1) });
    DfsBuild(n, 2);
    tree.opacity(0);

    id = 0; tree.opacity(1, 1);
    await DfsLook(n, 1);

    for (let i = 0; i < arrs.length; i++) {
        let arr = arrs[i];
        if (arr.length() > 1) {
            await sd.pause();
            tree.startAnimate();
            while (arr.length() > 1)
                arr.erase(0);
            tree.update();
            tree.endAnimate();
        }
    }
    await sd.pause();
    for (let i = 0; i < arrs.length; i++) {
        let arr = arrs[i];
        arr.startAnimate();
        arr.color(C.DEFAULT);
        arr.endAnimate();
    }
}

async function DfsLook(last, dep) {
    let me = ++id;
    await sd.pause();
    tree.startAnimate();
    let arr = tree.element(me);
    arr.color(arr.end(), C.RED);
    tree.endAnimate();
    arrs.push(arr);
    for (let i = 1; i <= Math.floor(last/2); i++) {
        p[dep] = i;
        let child = id+1;
        await sd.pause();
        tree.startAnimate();
        tree.opacity(me, child, 1);
        tree.opacity(child, 1);
        tree.endAnimate();
        await DfsLook(i, dep+1);
        p[dep] = 0;
    }
}


function DfsBuild(last, dep) {
    let me = ++id;
    for (let i = 1; i <= Math.floor(last/2); i++) {
        p[dep] = i;
        let child = id+1;
        tree.link({ parent: me, id: child, value: makeArray(tree, p, dep) });
        DfsBuild(i, dep+1);
        p[dep] = 0;
    }
}

function makeArray(svg, arr, len) {
    let ans = sd.Array(svg);
    for (let i = 1; i <= len; i++)
        ans.push(arr[i]);
    return ans;
}