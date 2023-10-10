import * as sd from "#lib/slide";

let mathCode1 = `
\\begin{bmatrix}
? & ? & ? \\\\
? & ? & ? \\\\
? & ? & ?
\\end{bmatrix}
\\begin{bmatrix}
f(i-1,0) \\\\
f(i-1,1) \\\\
f(i-1,2)
\\end{bmatrix}
=
\\begin{bmatrix}
f(i,0) \\\\
f(i,1) \\\\
f(i,2)
\\end{bmatrix}`
let mathCode2 = `
\\begin{bmatrix}
? & ? & ? \\\\
? & ? & ? \\\\
\\infty & 0 & \\infty
\\end{bmatrix}
\\begin{bmatrix}
f(i-1,0) \\\\
f(i-1,1) \\\\
f(i-1,2)
\\end{bmatrix}
=
\\begin{bmatrix}
f(i,0) \\\\
f(i,1) \\\\
f(i,2)
\\end{bmatrix}`
let mathCode3 = `
\\begin{bmatrix}
? & ? & ? \\\\
0 & \\infty & \\infty \\\\
\\infty & 0 & \\infty
\\end{bmatrix}
\\begin{bmatrix}
f(i-1,0) \\\\
f(i-1,1) \\\\
f(i-1,2)
\\end{bmatrix}
=
\\begin{bmatrix}
f(i,0) \\\\
f(i,1) \\\\
f(i,2)
\\end{bmatrix}`
let mathCode4 = `
\\begin{bmatrix}
v_i & v_i & v_i \\\\
0 & \\infty & \\infty \\\\
\\infty & 0 & \\infty
\\end{bmatrix}
\\begin{bmatrix}
f(i-1,0) \\\\
f(i-1,1) \\\\
f(i-1,2)
\\end{bmatrix}
=
\\begin{bmatrix}
f(i,0) \\\\
f(i,1) \\\\
f(i,2)
\\end{bmatrix}`

let svg = sd.svg();
let math = sd.Mathjax(svg).height(100).drag(true);
math.math(mathCode1);

main();

async function main() {
    await sd.pause();
    math.startAnimate();
    math.math(mathCode2);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math(mathCode3);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math(mathCode4);
    math.endAnimate();
    await sd.pause();

    let tr = sd.Tree(svg).drag(true).resizeable(true);
    tr.x(400).y(250).width(500).layerHeight(100);
    tr.root(1);
    tr.link(1, 2);
    tr.link(1, 3);
    tr.link(2, 4);
    tr.link(2, 5);
    tr.link(3, 6);
    tr.link(3, 7);
    for (let i = 1; i <= 7; i++) {
        let mat = makeMatrix();
        let rule = function(parent, self) {
            self.cx(parent.cx());
            self.my(parent.y());
        }
        tr.element(i).children.push(mat, rule);
    }
}

function makeMatrix() {
    let grid = sd.Grid(svg);
    grid.n(3).m(3);
    grid.elementWidth(10).elementHeight(10);
    return grid;
}