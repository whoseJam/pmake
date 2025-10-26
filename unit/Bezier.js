import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestSourceAndTarget);

async function TestSourceAndTarget() {
    const bezier = new sd.Bezier(svg);
    bezier.source(100, 100).target(300, 200).strokeWidth(2);
    await sd.pause();
    bezier.startAnimate().source(150, 150).endAnimate();
    await sd.pause();
    bezier.startAnimate().target(400, 300).endAnimate();
    await sd.pause();
    bezier.startAnimate().source(50, 50).target(350, 150).endAnimate();
    await sd.pause();
    bezier.startAnimate().source(100, 300).target(400, 100).endAnimate();
}
