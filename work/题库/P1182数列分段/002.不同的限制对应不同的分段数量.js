import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let A = [0, 4, 2, 4, 5, 1];
let n = A.length - 1;
let startx = 100;
let starty = 100;
let gapx = 400;
let gapy = 60;

main();

async function main() {
    let curx = startx;
    let cury = starty;
    for (let i = 5; i <= 20; i++) {
        await sd.pause();
        let ans = solve(i);
        ans.cx(600).y(20).opacity(0);
        ans.startAnimate();
        ans.opacity(1);
        ans.endAnimate();
        ans.startAnimate();
        ans.x(curx).y(cury);
        ans.endAnimate();
        cury += gapy;
        if (cury >= 500) {
            curx += gapx;
            cury = starty;
        }
    }
}

function solve(limit) {
    let arr = sd.Array(svg).x(460).y(190).start(1).drag(true).resizeable(true);
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
    return arr;
}
