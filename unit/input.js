import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const i = new sd.Input(svg).x(100).y(100);

sd.main(async () => {
    await sd.pause();
    i.startAnimate().label("A").endAnimate();
    await sd.pause();
    console.log("value =", i.value());
})
