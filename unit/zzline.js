import * as sd from "@/sd";

const svg = sd.svg();
const l = new sd.ZZLine(svg);

sd.init(() => {
    l.source(200, 200).target(250, 400).bending(20);
})

sd.main(async () => {
    await sd.pause();
    l.startAnimate().target(400, 200).location("t").endAnimate();
})