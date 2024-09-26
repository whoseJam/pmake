import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).x(100).y(100).resize(10);
const idx = sd.Index(arr, "t");

sd.init(() => {
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().push(1).endAnimate();
    await sd.pause();
    arr.startAnimate().insert(1, 1).endAnimate();
    arr.startAnimate().insert(1, 2).endAnimate();
    await sd.pause();
    arr.startAnimate().start(2).endAnimate();
    await sd.pause();
    idx.startAnimate().gap(20).endAnimate();
    await sd.pause();
    idx.startAnimate().gap(3).endAnimate();
    idx.startAnimate().location("b").endAnimate();
})