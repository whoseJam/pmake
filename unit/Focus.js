import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).x(100).y(100).resize(10);
const grid = new sd.Grid(svg).x(100).y(180).n(5).m(5);

sd.init(() => {
})

sd.main(async () => {
    const focus1 = sd.Focus(arr);
    for (let i = 1; i < arr.length(); i += 2) {
        await sd.pause();
        focus1.startAnimate().focus(i).endAnimate();
    }
    await sd.pause();
    focus1.startAnimate().focus(2, 5).endAnimate();
    await sd.pause();
    focus1.startAnimate().focus().endAnimate();
    await sd.pause();
    focus1.startAnimate().focus(null).endAnimate();

    const focus2 = sd.Focus(grid);
    for (let i = 1; i < grid.n(); i += 2) {
        for (let j = 1; j < grid.m(); j += 2) {
            await sd.pause();
            focus2.startAnimate().focus(i, j).endAnimate();
        }
    }
    await sd.pause();
    focus2.startAnimate().focus().endAnimate();
    await sd.pause();
    focus2.startAnimate().focus(null).endAnimate();
})
