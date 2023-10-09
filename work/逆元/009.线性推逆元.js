import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = 40;
let cx = 600;
let cx1 = 300;
let cx2 = 900;
let GAP = 80;
let starth = 100;
let curh = starth;
let rows = [];

main();

async function main() {
    await row1();
    await row2();
    await row3();
    await row4();
    await row5();
    await row6();
    await row7();
    await row8();
}

function appear(e) {
    e.start_animate()
     .opacity(1)
     .end_animate();
}

async function row8() {
    let cf = sd.Latex(svg).drag(true).resizeable(true)
        .push("t", "t");
    let e = sd.Latex(svg).font_size(h)
        .push("inv[i]", "inv[i]")
        .equiv()
        .push("-", "-")
        .push("cof", cf)
        .push("*", "*")
        .push("inv[k]", "inv[k]")
        .push("mod", "(mod M)");
    e.cx(cx2).y(curh); curh += GAP;
    e.opacity(0);
    await sd.pause();
    appear(e);
    await sd.pause();
    cf.erase(0);
    cf.lfloor()
    cf.frac("M", "i");
    cf.rfloor();
    cf.element("M").push("M")
    cf.element("i").push("i")
    cf.maintain();
    e.start_animate()
    e.maintain();
    e.end_animate();

    await sd.pause();
    e.element("inv[k]").text("inv[M%i]")
    e.start_animate();
    e.maintain();
    e.end_animate();
    e.drag(true).resizeable(true);
}

async function row7() {
    let e = sd.Latex(svg).font_size(20)
        .push("i", "i")
        .push("*1", "*")
        .push("t", "t")
        .push("*2", "*")
        .push("inv[i]1", "inv[i]")
        .push("*3", "*")
        .push("inv[k]1", "inv[k]")
        .equiv()
        .push("-", "-")
        .push("k", "k")
        .push("*4", "*")
        .push("inv[i]2", "inv[i]")
        .push("*5", "*")
        .push("inv[k]2", "inv[k]")
        .push("(mod M)", "(mod M)");
    e.cx(cx2).y(curh); curh += GAP;
    e.opacity(0);
    await sd.pause();
    appear(e);
    await sd.pause();
    e.element("i")
     .start_animate()
     .color(C.red)
     .end_animate();
    e.element("inv[i]1")
     .start_animate()
     .color(C.red)
     .end_animate();
    e.element("k")
     .start_animate()
     .color(C.red)
     .end_animate();
    e.element("inv[k]2")
     .start_animate()
     .color(C.red)
     .end_animate();
    await sd.pause();
    e.start_animate();
    e.element("i").text("");
    e.element("*1").text("");
    e.element("inv[i]1").text("");
    e.element("*2").text("");
    e.element("k").text("");
    e.element("*4").text("");
    e.element("*5").text("");
    e.element("inv[k]2").text("");
    e.font_size(h).cx(cx2);
    e.maintain();
    e.end_animate();
}

async function row6() {
    await sd.pause();
    curh = starth;
    rows.forEach((row) => { 
        row.start_animate()
           .dx(-300)
           .end_animate();
    });
    let e = sd.Latex(svg).font_size(h)
        .push("i", "i")
        .push("*", "*")
        .push("t", "t")
        .push("+", "+")
        .push("k", "k")
        .equiv()
        .push("0", "0")
        .push("(mod M)", "(mod M)");
    e.cx(cx2).y(curh); curh += GAP;
    e.opacity(0);
    await sd.pause();
    appear(e);
    await sd.pause();
    e.element("+").text("-");
    e.start_animate()
     .swap(4, 6)
     .swap(3, 5);
    e.end_animate();
    await sd.pause();
    e.start_animate();
    e.element("0").text("");
    e.maintain();
    e.end_animate();
}

async function row5() {
    let el = sd.Latex(svg).font_size(h);
    el.push("i", "i")
      .push("*", "*")
      .push("t", "t")
      .push("+", "+")
      .push("k", "k")
    let ef = sd.Latex(svg).font_size(h)
    ef.push("(mod M)", "(mod M)");
    let e = sd.Latex(svg).font_size(h);
    e.push("el", "0")
     .equiv()
     .push("er", el)
     .push("ef", ef);
    e.opacity(0).cx(cx).y(curh)
    await sd.pause();
    appear(e);
    await sd.pause();
    e.start_animate()
     .swap(0, 2)
     .end_animate();
    rows.push(e);
}

async function row4() {
    let e = sd.Latex(svg).font_size(h)
    e.push("M", "M")
     .push("=", "=")
     .push("i", "i")
     .push("*", "*")
     .push("t", "t")
     .push("+", "+")
     .push("k", "k");
    e.opacity(0);
    e.cx(cx).y(curh); curh += GAP;
    await sd.pause();
    appear(e);
    rows.push(e);
}

async function row3() {
    let e = sd.Latex(svg).font_size(h);
    e.push("k", "k")
     .push("=", "=")
     .push("M", "M")
     .push("%", "%")
     .push("i", "i");
    e.opacity(0);
    e.cx(cx).y(curh); curh += GAP;
    await sd.pause();
    appear(e);
    rows.push(e);
}

async function row2() {
    let e = sd.Latex(svg).font_size(h);
    e.push("t", "t")
     .push("=", "=")
     .lfloor()
     .frac("M", "i")
     .rfloor();
    e.element("M")
     .push("M", "M");
    e.element("i")
     .push("i", "i");
    e.maintain();
    e.opacity(0);
    e.cx(cx).y(curh); curh += GAP;
    await sd.pause();
    appear(e);
    rows.push(e);
}

async function row1() {
    let e = sd.Latex(svg).font_size(h);
    e.push("M", "M")
     .push(",", ",")
     .push("i", "i");
    e.opacity(0);
    e.cx(cx).y(curh); curh += GAP;
    await sd.pause();
    appear(e);
    rows.push(e);
}