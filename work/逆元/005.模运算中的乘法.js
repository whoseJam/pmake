import * as sd from "#lib/slide";

let fs = 40;
let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let define = sd.Code(svg).code(`
对于给定的模数M，可以定义在这个模数上的乘法运算op，有：
            a ⊗ b = a * b % M
（为了表示方便，在以后用*代替⊗）
`).font_size(30).cx(600).cy(100).drag(true);
    await sd.pause();

    let id = sd.Text(svg, "单位元").font_size(fs).x(300).y(200);
    let e1 = sd.Latex(svg)
        .push("a", "a")
        .push("op", "*")
        .push("b", "b")
        .push("eq", "=")
        .push("c", "c")
        .push("m", "(mod M)");
    e1.x(300).y(270);

    await sd.pause();
    e1.start_animate();
    switch_to(e1.element(0), "?", e1);
    switch_to(e1.element(4), "b", e1);
    e1.end_animate();
    await sd.pause();
    e1.start_animate();
    switch_to(e1.element(0), "1", e1);
    e1.end_animate();
    await sd.pause();

    let inv = sd.Text(svg, "逆元").font_size(fs).x(300).y(400);
    let e2 = sd.Latex(svg)
        .push("a", "a")
        .push("op", "*")
        .push("b", "b")
        .push("eq", "=")
        .push("c", "c")
        .push("m", "(mod M)");
    e2.x(300).y(470);
    e2.opacity(0).start_animate().opacity(1).end_animate();
    inv.opacity(0).start_animate().opacity(1).end_animate();

    await sd.pause();
    e2.start_animate();
    switch_to(e2.element(0), "?", e2);
    e2.end_animate();
    await sd.pause();
    e2.start_animate();
    switch_to(e2.element(4), "e", e2);
    e2.end_animate();
    await sd.pause();
    e2.start_animate();
    switch_to(e2.element(4), "1", e2);
    e2.end_animate();
}


function switch_to(txt, str, fa) {
    txt.start_animate(fa, { start: 0, duration: 0.5 }).dy(fs).opacity(0).end_animate()
       .text(str).dy(-fs*2)
       .start_animate(fa, { start: 0.5, duration: 0.5 }).dy(fs).opacity(1).end_animate();
}
