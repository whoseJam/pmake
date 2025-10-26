import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestSourceAndTarget);

async function TestSourceAndTarget() {
    const brace = new sd.BraceCurve(svg);
    brace.source(100, 100).target(300, 200).strokeWidth(2);
    await sd.pause();
    brace.startAnimate().source(150, 150).endAnimate();
    await sd.pause();
    brace.startAnimate().target(400, 300).endAnimate();
    await sd.pause();
    brace.startAnimate().source(50, 50).target(350, 150).endAnimate();
    await sd.pause();
    brace.startAnimate().source(100, 300).target(400, 100).endAnimate();
}
