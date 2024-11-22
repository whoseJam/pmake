import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const arr = new sd.Array(svg).resize(n * 2).start(1);

sd.init(() => {
    sd.Brace(arr).brace(1, n * 2, "b").value("2n");
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().value(1, "A").endAnimate();
    await sd.pause();
    arr.startAnimate().value(n * 2, "B").endAnimate();
})