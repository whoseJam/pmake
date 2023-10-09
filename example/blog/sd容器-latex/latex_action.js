import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let x = 300;
let y = 80;

main();

function appear(e) {
    e.opacity(0)
     .x(x).cy(y)
     .dx(-30)
     .start_animate()
     .dx(30).opacity(1)
     .end_animate();
    y += 80;
}

async function main() {
    let t1 = sd.Latex(svg).push("M, i").cx(x).cy(y); appear(t1);
    await sd.pause();
    let MfloorI = sd.Latex(svg).lfloor().frac("M", "i").rfloor();
    let t2 = sd.Latex(svg).push("t").push("=").push(MfloorI); appear(t2)
    await sd.pause();
    let MModI = sd.Latex(svg).push("M").push("%").push("i");
    let t3 = sd.Latex(svg).push("k").push("=").push(MModI); appear(t3);
    await sd.pause();
    let t4 = sd.Latex(svg).push("M").push("=").push("i*t+k"); appear(t4);
    await sd.pause();
    t4.start_animate()
      .swap(0, 2)
      .end_animate();
    await sd.pause();
    t4.start_animate()
      .insert_after(1, "equiv")
      .erase(1)
      .push("(mod M)")
      .end_animate();
    await sd.pause();
    t4.start_animate()
      .replace(2, "push", [0])
      .end_animate();
    await sd.pause();
    let t5 = sd.Latex(svg).push("i").push("*").push("t").push("+").push("k").equiv().push("0").push("(mod M)").drag(true); appear(t5)
    await sd.pause();
    t5.start_animate()
      .erase(6)
      .swap(4, 5)
      .swap(3, 4)
      .replace(4, "push", ["-"])
      .end_animate();
    await sd.pause();
    t5.start_animate()
      .insert_after(5, "push", ["*"])
      .insert_after(6, "push", ["inv[i]"])
      .insert_after(7, "push", ["*"])
      .insert_after(8, "push", ["inv[k]"])
      .insert_after(2, "push", ["*"])
      .insert_after(3, "push", ["inv[i]"])
      .insert_after(4, "push", ["*"])
      .insert_after(5, "push", ["inv[k]"])
      .cx(600)
      .end_animate();
    await sd.pause()
    console.log(t5.element(4));
    t5.element(4)
      .start_animate()
      .color(C.RED)
      .end_animate();
    t5.element(0)
      .start_animate()
      .color(C.RED)
      .end_animate();
    await sd.pause();
    t5.start_animate()
      .erase(4)
      .erase(3)
      .erase(0)
      .insert_after(-1, "push", ["1"])
      .cx(600)
      .end_animate();
    await sd.pause();
    t5.start_animate()
      .erase(1)
      .erase(0)
      .cx(600)
      .end_animate();
    await sd.pause();
    t5.element(5)
      .start_animate()
      .color(C.RED)
      .end_animate();
    t5.element(9)
      .start_animate()
      .color(C.RED)
      .end_animate();
    await sd.pause();
    t5.start_animate()
      .erase(9)
      .erase(8)
      .replace(5, "push", [1])
      .cx(600)
      .end_animate();
    await sd.pause();
    t5.start_animate()
      .erase(6)
      .erase(5)
      .x(x)
      .end_animate();
    await sd.pause();
    let t6 = sd.Latex(svg).push("inv[i]").equiv().push("-").push("t").push("*").push("inv[").push("k").push("]").push("(mod M)"); appear(t6)
    await sd.pause();
    t6.start_animate()
      .replace(3, "push", [MfloorI])
      .end_animate();
    await sd.pause();
    t6.start_animate()
      .replace(6, "push", [MModI])
      .end_animate();
}