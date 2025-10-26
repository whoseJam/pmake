import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestAlignAndJustify);

async function TestAlignAndJustify() {
    new sd.Array(svg).x(100).y(100).resize(4);
    const arr = new sd.ValueArray(svg).x(100).y(100);
    arr.push(makeCircle());
    arr.push("123");
    arr.push(makeCircle());
    arr.push("456");
    await sd.pause();
    arr.startAnimate().align("y").endAnimate();
    await sd.pause();
    arr.startAnimate().align("cy").endAnimate();
    await sd.pause();
    arr.startAnimate().align("my").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("x").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("cx").endAnimate();
    await sd.pause();
    arr.startAnimate().justify("mx").endAnimate();
}

async function TestInsertAndErase() {
    const arr = new sd.ValueArray(svg).x(100).y(100);
    arr.push(makeCircle());
    await sd.pause();
    arr.startAnimate().insert(0, makeCircle()).endAnimate();
    await sd.pause();
    arr.startAnimate().insert(2, "5").insert(3, makeCircle()).endAnimate();
}

function makeCircle() {
    return new sd.Circle(svg).r(15).color(C.red);
}
