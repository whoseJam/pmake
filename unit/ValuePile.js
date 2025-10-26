import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestAlignAndJustify);

async function TestAlignAndJustify() {
    new sd.Pile(svg).x(100).y(300).resize(4);
    const arr = new sd.ValuePile(svg).x(100).y(300);
    arr.push(makeCircle());
    arr.push("123");
    arr.push(makeCircle());
    arr.push("456");
    await sd.pause();
    arr.startAnimate().align("x").endAnimate();
    await sd.pause();
    arr.startAnimate().align("cx").endAnimate();
    await sd.pause();
    arr.startAnimate().align("mx").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("y").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("cy").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("my").endAnimate();
}

async function TestInsertAndErase() {
    const arr = new sd.ValuePile(svg).x(100).y(300);
    arr.push(makeCircle());
    await sd.pause();
    arr.startAnimate().insert(0, makeCircle()).endAnimate();
    await sd.pause();
    arr.startAnimate().insert(2, "5").insert(3, makeCircle()).endAnimate();
}

function makeCircle() {
    return new sd.Circle(svg).r(15).color(C.red);
}
