import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 3;
let p = sd.make1d(10, 0);
let used = sd.make1d(10, false);
let tr = sd.ValueTree(svg).drag(true).resizeable(true);
tr.width(1120).x(50).y(50);
tr.layerHeight(150);
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
        value = makeArray(tr, p, dep - 1);
        tr.link({parent: prt, id: id, value: value});
    } else {
        value = sd.Array(tr).push();
        tr.root({id: id, value: value});
    }

    if (dep === n + 1) {
        return;
    }

    for (let i = 1; i <= n; i++) {
        if (used[i]) continue;
        used[i] = 1;
        p[dep] = i;
        await Dfs(dep + 1, me);
        used[i] = 0;
    }
}

function makeArray(svg, arr, len) {
    let ans = sd.Array(svg);
    for (let i = 1; i <= len; i++)
        ans.push(arr[i]);
    return ans;
}