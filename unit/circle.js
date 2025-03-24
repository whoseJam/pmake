import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const circle = new sd.Circle(svg);

sd.main(async () => {
    await sd.pause();
    circle.startAnimate().x(100).y(100).endAnimate();

    await sd.pause();
    circle.startAnimate().r(40).endAnimate();
});
