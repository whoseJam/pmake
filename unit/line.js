import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestValue);

async function TestValue() {
    const line = new sd.Line(svg, new sd.Rect(svg).color(C.blue)).source(100, 100).target(300, 200);
    // line.value(new sd.Rect(svg).color(C.blue));
}

async function TestText() {
    const line1 = new sd.Line(svg, "A");
    const line2 = new sd.Line(svg, new sd.Rect(svg).width(12).height(12)).x(100);
    console.log(line1.text()); // "A"
    // console.log(line2.text()); // this is invalid invoke
    await sd.pause();
    line1.text("B");
}

async function TestArrow() {
    const l1 = new sd.Line(svg).x(100).y(100);
    const l2 = new sd.Line(svg).x(200).y(100);
    const l3 = new sd.Line(svg).x(300).y(100);
    l1.arrow();
    l2.revArrow();
    l3.doubleArrow();
}

async function TestMarker() {
    const styles = ["arrow", "adaptiveArrow"];
    const lines = [];
    styles.forEach((style, i) => {
        const line = new sd.Line(svg);
        line.source(0, i * 40 + 100);
        line.target(200, i * 40 + 100);
        line.markerStart(style).markerEnd(style);
        lines.push(line);
    });
    sd.main(async () => {
        await sd.pause();
        lines.forEach(line => {
            line.startAnimate().strokeWidth(3).endAnimate();
        });
    });
}

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
