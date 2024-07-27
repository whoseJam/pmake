import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let n = 4;
let p = sd.make1d(10, 0);
let col = {};
let dia = {};
let diaRev = {};
let tr = sd.ValueTree(svg).drag(true).resizeable(true);
tr.width(1120).x(50).y(50);
tr.layerHeight(100);
let id = 0;

main();

async function main() {
    id = 0;
    await Dfs(1, 0);
    tr.opacity(0);

    await sd.pause();
    tr.startAnimate();
    tr.opacity(1);
    tr.endAnimate();
}

async function Dfs(dep, prt) {
    let me = ++id;
    let value;
    if (dep > 1) {
        value = makeGrid(tr, p, dep - 1);
        tr.link({parent: prt, id: id, value: value});
        tr.element(prt, id).background().markerEnd("arrow");
    } else {
        value = makeGrid(tr, n, dep - 1);
        tr.root({id: id, value: value});
    }

    if (dep === n + 1) {
        return;
    }

    for (let i = 1; i <= n; i++) {
        if (col[i] || dia[dep - i] || diaRev[dep + i]) continue;
        col[i] = true;
        dia[dep - i] = true;
        diaRev[dep + i] = true;
        p[dep] = i;
        await Dfs(dep + 1, me);
        p[dep] = 0;
        col[i] = false;
        dia[dep - i] = false;
        diaRev[dep + i] = false; 
    }
}

function makeGrid(svg, arr, len) {
    let ans = sd.Grid(svg).startN(1).startM(1);
    ans.elementWidth(20).elementHeight(20).n(n).m(n);
    for (let i = 1; i <= len; i++)
        ans.value(i, arr[i], sd.Circle(ans).color(C.ORANGE));
    return ans;
}