import * as sd from "@/sd";

let svg = sd.svg();
let R = sd.rule();
let a = sd.Array(svg).x(200).y(100).start(1);
let b = sd.Array(svg).x(200).y(200).start(1);
let x = sd.Array(svg).x(200).y(350).start(1);
let y = sd.Array(svg).x(200).y(450).start(1);
let pa = 1, pb = 1;
for (let i = 1; i <= 10; i++) {
    a.push(sd.Mathjax(svg).math(`x_{${i}}`))
    b.push(sd.Mathjax(svg).math(`y_{${i}}`))
    a.value(i).height(15).cx(a.element(i).cx()).cy(a.element(i).cy());
    b.value(i).height(15).cx(b.element(i).cx()).cy(b.element(i).cy());
}
let l = sd.Line(svg).strokeWidth(2);
let next = "a";
track(l, 1, 1, false);

document.addEventListener('keydown', (e) => {{
    if (e.key === 'f' || e.key === 'F') {
        next = "a";
    } else if (e.key === "d" || e.key === "D") {
        next = "b";
    } else if (e.key === "s" || e.key === "S") {
        next = "t";
    }
}})

main();

function pushMath(arr, math) {
    arr.startAnimate();
    arr.push();
    let e = arr.element(arr.end());
    e._.valueRule = R.CenterOnly();
    e.value(sd.Mathjax(svg).math(math).height(15))
    arr.endAnimate();
}

async function main() {
    await sd.pause();
    pushMath(x, "x_1");
    pushMath(y, "y_1");

    while(pa < 10 || pb < 10) {
        await sd.pause();
        if (next === "a") { 
            if (pa < 10) {
                track(l, ++pa, pb);
                await sd.pause();
                pushMath(x, `x_{${pa}}`);
                pushMath(y, `y_{${pb}}`);
            }
        } else if (next === "b") {
            if (pb < 10) {
                track(l, pa, ++pb);
                await sd.pause();
                pushMath(x, `x_{${pa}}`);
                pushMath(y, `y_{${pb}}`);
            }
        } else if (next === "t") {
            if (pa < 10 && pb < 10) {
                track(l, ++pa, ++pb);
                await sd.pause();
                pushMath(x, `x_{${pa}}`);
                pushMath(y, `y_{${pb}}`);
            }
        }
    }
}

function track(l, i, j, animate = true) {
    let aelem = a.element(i);
    let belem = b.element(j);
    if (animate) l.startAnimate();
    l.source(aelem.cx(), aelem.my());
    l.target(belem.cx(), belem.y());
    if (animate) l.endAnimate();
    else l.opacity(0).startAnimate().opacity(1).endAnimate();
}