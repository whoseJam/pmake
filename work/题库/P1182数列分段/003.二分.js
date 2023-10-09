import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let A = [0, 4, 2, 4, 5, 1];
let n = A.length - 1;
let segmentsNum = 2;
let tSegmentsNum = sd.Text(svg, `M=${segmentsNum}`).x(550).y(40).fontSize(50).drag(true).resizeable(true);
let arr = sd.Array(svg).x(360).y(120).drag(true).resizeable(true);
let sumA = 0, maxA = 0;
for (let i = 1; i <= n; i++) {
    sumA += A[i];
    maxA = Math.max(maxA, A[i]);
}
arr.start(maxA);
for (let i = 5; i <= sumA; i++)
    arr.push(i);
sd.EnableArrayName(arr, "如果我让limit=...?");
sd.EnableArrayPointer(arr);

main();

async function main() {
    arr.makePointer("l", 0).movePointer("l", maxA);
    arr.makePointer("r", 2).movePointer("r", sumA);

    while (arr.wherePointer("l") <= arr.wherePointer("r")) {
        let mid = Math.floor((arr.wherePointer("l") + arr.wherePointer("r")) / 2);
        await sd.pause();
        arr.makePointer("mid", 1);
        if (mid === arr.wherePointer("l")) arr.pointer("mid").length = 60;
        arr.movePointer("mid", mid);
        arr.pointer("mid").opacity(0);
        arr.startAnimate();
        arr.pointer("mid").opacity(1);
        arr.endAnimate();

        await sd.pause();
        let ans = solve(mid);
        let tst = ans[0];
        let cnt = ans[1];
        tst.opacity(0).dx(-40);
        tst.startAnimate();
        tst.opacity(1).dx(40);
        tst.endAnimate();

        if (cnt > segmentsNum) {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("l", mid + 1);
            arr.endAnimate();
        } else {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("r", mid - 1);
            arr.endAnimate();
        }
        await sd.pause();
        let p = arr.pointer("mid");
        p.startAnimate().opacity(0).endAnimate();
        arr.after(p).removePointer("mid");
        tst.startAnimate().opacity(0).endAnimate().remove();
    }

    await sd.pause();
    arr.startAnimate();
    for (let i = maxA; i <= arr.wherePointer("r"); i++)
        arr.color(i, C.red);
    for (let i = arr.wherePointer("l"); i <= sumA; i++)
        arr.color(i, C.green);
    arr.endAnimate();
}

function solve(limit) {
    let arr = sd.Array(svg).x(460).y(290).start(1).drag(true).resizeable(true);
    for (let i = 1; i <= n; i++) arr.push(A[i]);
    let cur = limit, curColor = C.blue, cnt = 1;
    function revColor() {
        if (curColor === C.blue) curColor = C.red;
        else curColor = C.blue;
    }
    for (let i = 1; i <= n; i++) {
        if (A[i] > cur) {
            cnt++;
            revColor();
            cur = limit - A[i];
            arr.color(i, curColor);
        } else {
            cur -= A[i];
            arr.color(i, curColor);
        }
    }
    sd.EnableArrayName(arr, `limit=${limit}`);
    let txt = sd.Text(arr, `cnt=${cnt}`);
    let rule = () => {
        txt.height(arr.height());
        txt.x(arr.mx() + 10);
        txt.cy(arr.cy());
    }
    arr.children.push(txt, rule);
    return [arr, cnt];
}
