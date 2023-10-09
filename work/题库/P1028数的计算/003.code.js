import * as sd from "#lib/slide";

let code = `
void Dfs(int last){
    ans++;
    for(int i=1;i<=last/2;i++){
        Dfs(i);
    }
}`;
let codeLines = {
    startDfs: [1],
    countAns: [2],
    iterate: [3],
    wholeIterate: [3, 5],
    nextDfs: [4],
    end: [6]
};

let svg = sd.svg();
let C = sd.color();
let ansStack = sd.ValuePile(svg).x(970).y(550).drag(true).resizeable(true);
let tree = sd.ValueTree(svg).x(185).y(50).width(800).layerHeight(80).drag(true).resizeable(true);
let call = sd.CallStack(svg).x(120).y(240).fontSize(20).drag(true).resizeable(true);
let n = 10;
let id;

ansStack.preIn((elem) => { elem.startAnimate(ansStack); });
ansStack.in(() => {});

main();

async function main() {
    id = 0;
    tree.root({ id: 1, value: makeArray(tree, [0, n], 1) });
    DfsBuild(n, 2);
    tree.opacity(0);

    id = 0; tree.opacity(1, 1);
    await DfsCall(n);
}

async function DfsCall(last, prt) {
    let me = ++id;
    await sd.pause();
    call.startAnimate();
    call.enter({ name: "Dfs", args: [
        { name: "last", value: last }
    ]}, code);
    call.code().highlight.apply(call.code(), codeLines.startDfs);
    call.endAnimate();
    tree.startAnimate();
    tree.opacity(me, 1);
    if (prt) tree.opacity(prt, me, 1);
    tree.endAnimate();

    await sd.pause();
    call.startAnimate();
    call.code().highlight.apply(call.code(), codeLines.countAns);
    call.endAnimate();
    await sd.pause();
    tree.startAnimate();
    tree.color(me, C.GREEN);
    tree.endAnimate();
    
    let ans = await climb(me);
    await sd.pause();
    ansStack.startAnimate();
    ansStack.push(ans);
    ansStack.endAnimate();

    let lim = Math.floor(last / 2);
    if (lim >= 1) {
        await sd.pause();
        call.startAnimate();
        call.code().highlight.apply(call.code(), codeLines.wholeIterate);
        call.endAnimate();
        await sd.pause();
        call.startAnimate()
        let ti = makeI(call.func(), 1);
        ti.opacity(0).startAnimate(call).opacity(1);
        call.endAnimate();
        for (let i = 1; i <= lim; i++) {
            await sd.pause();
            call.startAnimate();
            call.code().highlight.apply(call.code(), codeLines.iterate);
            call.endAnimate();
            await sd.pause();
            call.startAnimate();
            call.code().highlight.apply(call.code(), codeLines.nextDfs);
            call.endAnimate();
    
            await DfsCall(i, me);

            await sd.pause();
            ti.startAnimate().opacity(0).endAnimate();
            ti.text(`i=${i+1}`);
            ti.startAnimate().opacity(1).endAnimate();
        }   
    }

    await sd.pause();
    call.startAnimate();
    call.code().highlight.apply(call.code(), codeLines.end);
    call.endAnimate();

    await sd.pause();
    call.startAnimate();
    call.exit();
    call.endAnimate();
}


function DfsBuild(last, dep) {
    let me = ++id;
    for (let i = 1; i <= Math.floor(last/2); i++) {
        let child = id+1;
        tree.link({ parent: me, id: child, value: makeArray(tree, [0, i], 1) });
        DfsBuild(i, dep+1);
    }
}

async function climb(x) {
    let stamp = 0;
    let txts = [];
    let arr = sd.Array(ansStack).x(720).y(270);
    while (x) {
        let originVal = tree.element(x).value(0);
        let val = +originVal.text();
        let txt = sd.Text(arr, val);
        txts.push({ txt: txt, originVal: originVal, x: x });
        x = tree.father(x);
    }
    for (let i = txts.length - 1; i >= 0; i--) {
        let txt = txts[i].txt, originVal = txts[i].originVal, x = txts[i].x;
        txt.fontSize(originVal.fontSize());
        txt.cx(originVal.cx());
        txt.cy(originVal.cy());
        txt.after(stamp).startAnimate();
        txt.dx(tree.element(x).elementWidth());
        txt.endAnimate();
        stamp = txt.delay();
    }

    await sd.pause();
    for (let i = txts.length - 1; i >= 0; i--) {
        arr.in((elem) => {
            elem.opacity(0)
                .startAnimate(arr)
                .opacity(1);
            elem.preIn((value) => { value.startAnimate(elem); });
            elem.in(() => {});
            elem.value(txts[i].txt);
        });
        arr.startAnimate();
        arr.push();
        arr.endAnimate();
    }
    return arr;
}

function makeArray(svg, arr, len) {
    let ans = sd.Array(svg);
    for (let i = 1; i <= len; i++)
        ans.push(arr[i]);
    return ans;
}

function makeI(svg, i) {
    let txt = sd.Text(svg);
    txt.text(`i=${i}`);
    let rule = () => {
        txt.fontSize(svg.fontSize())
        txt.x(svg.mx() + 10);
        txt.cy(svg.cy());
    };
    svg.children.push("i", txt, rule);
    return txt;
}