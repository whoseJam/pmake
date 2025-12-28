import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestSubtextColor);

async function TestSubtextColor() {
    const text = new sd.Math({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 100,
        text: "abcabcabc",
    });
    await sd.pause();
    text.startAnimate().setSubtextFill("bc", C.red).endAnimate();
    await sd.pause();
    text.startAnimate().setSubtextFill("c", C.textBlue).endAnimate();
    await sd.pause();
    text.startAnimate().setFill(C.purple).endAnimate();
    await sd.pause();
    text.startAnimate().setFill(C.grey).endAnimate();
}

async function TestTransformWithPosition() {
    const text1 = new sd.Math({
        targetNode: svg,
        x: 100,
        y: 100,
        fontSize: 50,
        text: "hello",
    });
    const text2 = new sd.Math({
        targetNode: svg,
        x: 100,
        y: 200,
        fontSize: 50,
        text: "hello",
    });
    const text3 = new sd.Math({
        targetNode: svg,
        x: 100,
        y: 300,
        fontSize: 50,
        text: "hello",
    });
    await sd.pause();
    text1.startAnimate().setX(200).endAnimate();
    text2.startAnimate().setText("world").setX(200).endAnimate();
    text3.startAnimate().setX(200).setText("world").endAnimate();
}

async function TestPosition() {
    const math = new sd.Math({
        targetNode: svg,
        text: "a",
        x: 100,
        y: 100,
    });
    await sd.pause();
    math.startAnimate().setX(200).setY(300).endAnimate();
}

async function TestPythagoreanTheorem() {
    const math = new sd.Math({
        targetNode: svg,
        text: "a",
    });
    await sd.pause();
    math.startAnimate().setText("a^2").endAnimate();
}
