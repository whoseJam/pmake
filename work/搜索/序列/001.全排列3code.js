import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 3;
let p = sd.Array(svg).x(670).y(180).drag(true).resizeable(true);
let used = sd.Array(svg).x(670).y(80).resize(10).drag(true).resizeable(true);
let tr = sd.ValueTree(svg).drag(true).resizeable(true);
tr.width(1050).x(80).y(250);
tr.layerHeight(80);
let callStack = sd.CallStack(svg).fontSize(14).drag(true).resizeable(true);
let id;

sd.EnableArrayName(p, "p数组");
sd.EnableArrayName(used, "used数组");
let code = `
void Dfs(int dep){
    if(dep==n+1){
        找到一个排列;
        return;
    }
    for(int i=1;i<=n;i++){
        if(!used[i]){
            修改状态;
            Dfs(dep+1);
            回溯状态;
        }
    }
}`;
let codeLines = {
    start: [1],
    checkEnd: [2],
    end: [3, 4],
    iterator: [6],
    notUsedBlock: [7, 11],
    modifyStatus: [8],
    dfs: [9],
    rollback: [10],
    finish: [11]
};

main();

async function main() {
    id = 0;
    await DfsBuild(1, 0);
    tr.opacity(0);

    await sd.pause();
    tr.startAnimate();
    tr.opacity(1);
    tr.endAnimate();

    id = 0;
    await sd.pause();
    tr.startAnimate();
    tr.color(1, C.GREEN);
    tr.endAnimate();
    await DfsLook(1, 0);
    await sd.pause();
    tr.startAnimate();
    tr.color(1, C.GREY);
    tr.endAnimate();
}


async function DfsLook(dep) {
    await sd.pause();
    callStack.startAnimate();
    callStack.enter({ name: "Dfs", args: [{ name: "dep", value: dep }]}, code);
    callStack.highlight(codeLines.start);
    callStack.endAnimate();

    await sd.pause();
    callStack.startAnimate();
    callStack.highlight(codeLines.checkEnd);
    callStack.endAnimate();
    let me = ++id;

    if (dep === n + 1) {
        await sd.pause();
        callStack.startAnimate();
        callStack.highlight(codeLines.end);
        callStack.endAnimate();
        await sd.pause();
        callStack.startAnimate();
        callStack.exit();
        callStack.endAnimate();
        return;
    }

    await sd.pause();
    callStack.startAnimate();
    callStack.highlight(codeLines.iterator);
    callStack.endAnimate();

    for (let i = 1; i <= n; i++) {
        if (used.element(i).used) continue;
        await sd.pause();
        callStack.startAnimate();
        callStack.highlight(codeLines.notUsedBlock);
        callStack.endAnimate();
        await sd.pause();
        callStack.startAnimate();
        callStack.highlight(codeLines.modifyStatus);
        callStack.endAnimate();

        let cid = id + 1;
        await sd.pause();
        tr.startAnimate();
        tr.color(me, cid, C.red);
        tr.element(me, cid).background().strokeWidth(3);
        tr.endAnimate();
        await sd.pause();
        p.startAnimate();
        p.push(i);
        p.endAnimate();
        used.startAnimate();
        used.value(i, sd.Text(svg, "true"));
        used.endAnimate();
        used.element(i).used = true;
        await sd.pause();
        callStack.startAnimate();
        callStack.highlight(codeLines.dfs);
        callStack.endAnimate();
        await sd.pause();
        tr.startAnimate();
        tr.color(cid, C.GREEN);
        tr.endAnimate();

        await DfsLook(dep + 1, me);

        await sd.pause();
        callStack.startAnimate();
        callStack.highlight(codeLines.rollback);
        callStack.endAnimate();

        await sd.pause();
        p.startAnimate();
        p.pop(i);
        p.endAnimate();
        used.startAnimate();
        used.value(i, null);
        used.endAnimate();
        used.element(i).used = false;

        await sd.pause();
        tr.startAnimate();
        tr.color(cid, C.GREY);
        tr.endAnimate();
        tr.startAnimate();
        tr.color(me, cid, C.black);
        tr.element(me, cid).background().strokeWidth(1);
        tr.endAnimate();
    }
    await sd.pause();
    callStack.startAnimate();
    callStack.highlight(codeLines.finish);
    callStack.endAnimate();
    await sd.pause();
    callStack.startAnimate();
    callStack.exit();
    callStack.endAnimate();
}

async function DfsBuild(dep, prt) {
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
        await DfsBuild(dep + 1, me);
        used[i] = 0;
    }
}

function makeArray(svg, arr, len) {
    let ans = sd.Array(svg);
    for (let i = 1; i <= len; i++)
        ans.push(arr[i]);
    return ans;
}