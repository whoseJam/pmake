import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const at = 5;
const lk = 3;
const rk = 8;
const arr = new sd.Array(svg).start(1);

sd.init(() => {
    arr.resize(n);
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(at, C.blue).value(at, "k").endAnimate();
    await sd.pause();
    arr.startAnimate().color(lk, C.blue).endAnimate();
    await sd.pause();
    arr.startAnimate().color(rk, C.blue).endAnimate();
});