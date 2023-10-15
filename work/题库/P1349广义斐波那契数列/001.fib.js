import * as sd from "#lib/slide";

let naiveMath = `a_n=p\\cdot a_{n-1}+q\\cdot a_{n-2}`
let matMath1 = `
\\begin{bmatrix}
? & ?  \\\\
? & ? \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_1 \\\\
a_2
\\end{bmatrix}
=
\\begin{bmatrix}
a_2 \\\\
a_3
\\end{bmatrix}`;
let matMath2 = `
\\begin{bmatrix}
0 & 1  \\\\
? & ? \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_1 \\\\
a_2
\\end{bmatrix}
=
\\begin{bmatrix}
a_2 \\\\
a_3
\\end{bmatrix}`;
let matMath3 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_1 \\\\
a_2
\\end{bmatrix}
=
\\begin{bmatrix}
a_2 \\\\
a_3
\\end{bmatrix}`;

let matMath4 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_2 \\\\
a_3
\\end{bmatrix}
=
\\begin{bmatrix}
a_3 \\\\
a_4
\\end{bmatrix}`;
let matMath5 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_3 \\\\
a_4
\\end{bmatrix}
=
\\begin{bmatrix}
a_4 \\\\
a_5
\\end{bmatrix}`;
let matMath6 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
\\begin{bmatrix}
a_{n-2} \\\\
a_{n-1}
\\end{bmatrix}
=
\\begin{bmatrix}
a_{n-1} \\\\
a_{n}
\\end{bmatrix}`;
let matMath7 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
^2
\\begin{bmatrix}
a_{n-3} \\\\
a_{n-2}
\\end{bmatrix}
=
\\begin{bmatrix}
a_{n-1} \\\\
a_{n}
\\end{bmatrix}`;
let matMath8 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
^3
\\begin{bmatrix}
a_{n-4} \\\\
a_{n-3}
\\end{bmatrix}
=
\\begin{bmatrix}
a_{n-1} \\\\
a_{n}
\\end{bmatrix}`;
let matMath9 = `
\\begin{bmatrix}
0 & 1  \\\\
q & p \\\\
\\end{bmatrix}
^{(n-2)}
\\begin{bmatrix}
a_1 \\\\
a_2
\\end{bmatrix}
=
\\begin{bmatrix}
a_{n-1} \\\\
a_{n}
\\end{bmatrix}`;

let svg = sd.svg();
let m1 = sd.Mathjax(svg).height(50).math(naiveMath).cx(600).y(50);
let m2 = sd.Mathjax(svg).height(100).math("").x(100).y(200);

main();

async function main() {
    await sd.pause();
    m2.startAnimate().math(matMath1).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath2).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath3).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath4).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath5).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath6).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath7).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath8).endAnimate();
    await sd.pause();
    m2.startAnimate().math(matMath9).endAnimate();
}
