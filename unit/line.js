import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestLine);

async function TestLine() {
    const line = new sd.Line(svg).x(100).y(100);
    await sd.pause();
    line.startAnimate().width(100).endAnimate();
    await sd.pause();
    line.startAnimate().height(200).endAnimate();
    await sd.pause();
    line.arrow();
    await sd.pause();
    line.startAnimate().strokeWidth(5).endAnimate();
}

async function TestPointAndFade() {
    await sd.pause();
    const obj = new sd.Line(svg).source(100, 100).target(500, 200);
    obj.value("2");
    await sd.pause();
    obj.arrow();
    while (true) {
        await sd.pause();
        obj.startAnimate().dx(40).endAnimate();
        await sd.pause();
        console.log("P S -> T");
        obj.startAnimate().pointStoT().endAnimate();
        await sd.pause();
        console.log("F S -> T");
        obj.startAnimate().fadeStoT().endAnimate();
        await sd.pause();
        console.log("P T -> S");
        obj.startAnimate().pointTtoS().endAnimate();
        await sd.pause();
        console.log("F T -> S");
        obj.startAnimate().fadeTtoS().endAnimate();
    }
}
