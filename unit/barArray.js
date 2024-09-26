import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg).x(100).y(400);

sd.init(() => {
})

sd.main(async () => {
    await sd.pause();
    bar.startAnimate().push(5).endAnimate();
    await sd.pause();
    bar.startAnimate().push(4).endAnimate();
    bar.startAnimate().push(3).endAnimate();
    await sd.pause();
    bar.startAnimate().push(2).push(1).endAnimate();
    await sd.pause();
    bar.startAnimate().erase(1).endAnimate();
    bar.startAnimate().erase(2).endAnimate();
    await sd.pause();
    bar.startAnimate().elementWidth(50).endAnimate();
    bar.startAnimate().elementHeight(20).endAnimate();
    console.assert(bar.intValue(1) === 3);
    await sd.pause();
    bar.startAnimate().sort().endAnimate();
})
