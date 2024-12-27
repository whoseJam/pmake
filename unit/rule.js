import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const a = new sd.Rect(svg).x(100).y(100);
const b = new sd.Rect(svg);

sd.init(() => {
    a.childAs("b", b, R.aside("rc"));
})

sd.main(async () => {
    await sd.pause();
    a.startAnimate().dx(100).endAnimate();
})