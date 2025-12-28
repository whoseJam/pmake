import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestPosition);

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
