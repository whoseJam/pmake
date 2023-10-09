import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let start = 0;
    await mod(10, 3, 30, 100);
    await mod(5, 8, 30, start = 150);
    for (let i = 1; i <= 10; i++) {
        let a = sd.rand(2, 15);
        let b = sd.rand(2, 15);
        start += 50;
        await mod(a, b, 30, start);
    }
}

async function mod(a, M, fs, starty) {
    let e = sd.Latex(svg)
        .push("a", a)
        .push("op", "%")
        .push("b", M)
        .push("eq", "=")
        .push("c", a % M)
        .x(100).y(starty).opacity(0)
        .font_size(fs);
    await sd.pause();
    e.start_animate();
    for (let i = 0; i <= 3; i++)
        e.element(i)
         .start_animate(e)
         .opacity(1)
         .end_animate();
    e.end_animate();
    await sd.pause();
    e.start_animate();
    e.element("c")
     .start_animate(e)
     .opacity(1)
     .end_animate();
    e.end_animate();
}