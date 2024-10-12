import * as sd from "@/sd";
import { A } from "@svgdotjs/svg.js";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(10).x(100).y(100);
const stk = new sd.Stack(svg).resize(10).x(800).y(100);

sd.init(() => {

})

sd.main(async () => {
    const b = sd.Brace(arr);
    await sd.pause();
    b.after(900).startAnimate().brace(1, 3).endAnimate();

    const brace1 = sd.Brace(arr);
    await sd.pause();
    brace1.startAnimate().brace(1, 3).endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(2, 4).endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(3, 6, "b").endAnimate();
    await sd.pause();
    brace1.startAnimate().value("hello").endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(3, 7).endAnimate();
    await sd.pause();
    brace1.startAnimate().valueGap(50).endAnimate();

    const brace2 = sd.Brace(stk);
    await sd.pause();
    brace2.startAnimate().brace(1, 3, "l").endAnimate();
    await sd.pause();
    brace2.startAnimate().brace(2, 4).endAnimate();
    await sd.pause();
    brace2.startAnimate().brace(3, 6, "r").endAnimate();
    await sd.pause();
    brace2.startAnimate().value("world").endAnimate();
    await sd.pause();
    brace2.startAnimate().braceGap(30).endAnimate();
})

