import * as sd from "@/sd";

let svg = sd.svg();
let R = sd.reader();
let nA = 6, nB = 4;
let dataA = R.readIntArray("3 -1 -2 1 2 0", 6);
let dataB = R.readIntArray("1 2 -1 -3", 4);
let A = sd.Stack(svg).drag(true).resizeable(true);
let B = sd.Array(svg).drag(true).resizeable(true);
let C = sd.Grid(svg).drag(true).resizeable(true);
sd.EnableArrayName(B, "B数组", 20);
sd.EnableTitle(A, "A数组", 20);
for (let i = 1; i <= nA; i++)
    A.push(dataA[i]);
for (let i = 1; i <= nB; i++)
    B.push(dataB[i]);
A.x(310).y(150);
B.x(460).y(60);
C.m(nB).startN(1).startM(1).x(460).y(150);


main();

async function main() {
    for (let i = 1; i <= nA; i++) {
        await sd.pause();
        C.startAnimate();
        C.pushRow();
        for (let j = 1; j <= nB; j++) {
            C.value(i, j, sd.Text(C, dataA[i] * dataB[j]));
        }
        C.endAnimate();
    }
    await sd.pause();
    let cond = sd.Mathjax(svg).drag(true).resizeable(true);
    cond.math("对于给定的l_1,r_1,l_2,r_2").x(720).y(60);
    let math = sd.Mathjax(svg).drag(true).resizeable(true);
    math.math(`
    \\forall x \\in [l_1,r_1] \\rightarrow \\begin{cases}
    ? & A[x]\\gt 0 \\\\
    ? & A[x]\\le 0
    \\end{cases}`).x(720).y(160);
    await sd.pause();
    // math.startAnimate();
    math.math(`
    \\forall x \\in [l_1,r_1] \\rightarrow \\begin{cases}
    A[x]\\cdot Askmin(l_2,r_2) & A[x]\\gt 0 \\\\
    A[x]\\cdot Askmax(l_2,r_2) & A[x]\\le 0
    \\end{cases}`).x(720).y(160);
    // math.endAnimate();
}