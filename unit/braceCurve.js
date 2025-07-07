import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const brace = new sd.BraceCurve(svg);
    brace.source(100, 100).target(200, 100).startAnimate().pointStoT().value("hello", R.pointAtPathByRate(0.5, "cx", "my")).endAnimate();
});
