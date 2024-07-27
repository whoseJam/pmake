import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let A = [0, 4, 2, 4, 5, 1];
let n = A.length - 1;
let limit = 8;
let tLimit = sd.Text(svg, `limit=${limit}`).x(490).y(70).fontSize(35).drag(true).resizeable(true);
let arr = sd.Array(svg).x(460).y(190).start(1).drag(true).resizeable(true);
for (let i = 1; i <= n; i++) arr.push(A[i]);

main();

async function main() {
    let cur = limit, curColor = C.blue;
    function revColor() {
        if (curColor === C.blue) curColor = C.red;
        else curColor = C.blue;
    }
    for (let i = 1; i <= n; i++) {
        if (A[i] >= cur) {
            revColor();
            cur = limit - A[i];
            await sd.pause();
            arr.startAnimate();
            arr.color(i, curColor);
            arr.endAnimate();
        } else {
            cur -= A[i];
            await sd.pause();
            arr.startAnimate();
            arr.color(i, curColor);
            arr.endAnimate();
        }
    }
}
