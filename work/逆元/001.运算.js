import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let fs = 50;

main();

async function main() {
    let e1 = sd.Latex(svg)
        .push("a", "1")
        .push("op", "+")
        .push("b", "1")
        .push("eq", "=")
        .push("c", "2");

    e1.x(510).y(250).drag(true);
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("a"), "2", e1);
    switch_to(e1.element("c"), "3", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("a"), "3", e1);
    switch_to(e1.element("c"), "4", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("a"), "4", e1);
    switch_to(e1.element("c"), "5", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("b"), "2", e1);
    switch_to(e1.element("c"), "6", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("b"), "3", e1);
    switch_to(e1.element("c"), "7", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("a"), "4", e1);
    switch_to(e1.element("c"), "8", e1);
    e1.end_animate();
    await sd.pause();

    for (let a = 5; a <= 30; a++) {
        let b = Math.floor(a * 1.5 + 1);
        e1.start_animate(100);
        switch_to(e1.element("a"), a, e1);
        switch_to(e1.element("b"), b, e1);
        switch_to(e1.element("c"), a+b, e1);
        e1.maintain();
        e1.end_animate();
    }

    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("a"), "a", e1);
    e1.maintain();
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("b"), "b", e1);
    e1.maintain();
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("c"), "c", e1);
    e1.maintain();
    e1.end_animate();
    await sd.pause();

    e1.start_animate(600);
    switch_to(e1.element("op"), "-", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate(600);
    switch_to(e1.element("op"), "*", e1);
    e1.end_animate();
    await sd.pause();

    e1.start_animate(600);
    switch_to(e1.element("op"), "/", e1);
    e1.end_animate();
    await sd.pause();
    
    e1.start_animate(600);
    switch_to(e1.element("op"), "⊕", e1);
    e1.maintain();
    e1.end_animate();
    await sd.pause();

    let id = sd.Text(svg, "单位元").x(200).y(200).font_size(30).opacity(0);
    let inv = sd.Text(svg, "逆元").x(600).y(200).font_size(30).opacity(0);
    
    id.start_animate().opacity(1).end_animate();
    e1.start_animate();
    e1.x(id.x()).y(300);
    e1.end_animate();
    await sd.pause();

    e1.start_animate();
    switch_to(e1.element("c"), "b", e1);
    e1.end_animate();
    await sd.pause();

    let e2 = sd.Latex(svg)
        .push("a", "a")
        .push("op", "⊕")
        .push("b", "b")
        .push("eq", "=")
        .push("c", "c");
    inv.start_animate().opacity(1).end_animate();
    e2.x(inv.x()).y(300).opacity(0)
      .after(inv)
      .start_animate()
      .opacity(1)
      .end_animate();
    
    await sd.pause();

    e2.start_animate();
    switch_to(e2.element("c"), "e", e2);
    e2.end_animate();
}

function switch_to(txt, str, fa) {
    txt.start_animate(fa, { start: 0, duration: 0.5 }).dy(fs).opacity(0).end_animate()
       .text(str).dy(-fs*2)
       .start_animate(fa, { start: 0.5, duration: 0.5 }).dy(fs).opacity(1).end_animate();
}
