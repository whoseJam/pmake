import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestPythagoreanTheorem);

async function TestPythagoreanTheorem() {
    const math = new sd.Math({
        targetNode: svg,
        text: "a",
    });
    await sd.pause();
    math.startAnimate().setText("a^2").endAnimate();
}
