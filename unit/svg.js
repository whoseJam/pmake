import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const view = new sd.View(svg);
const box = new sd.Rect(view).color(C.red);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    view.push(box);
    await sd.pause();
    view.startAnimate().viewBox(-5, -5, 100, 100).endAnimate();
});
