import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestAxisAndAlign);

async function TestAxisAndAlign() {
    let cnt = 0;
    const grid = new sd.ValueGrid(svg).x(100).y(100).startN(1).startM(1);
    for (let i = 1; i <= 3; i++)
        for (let j = 1; j <= i; j++) {
            grid.insert(i, j, ++cnt);
        }
    await sd.pause();
    grid.startAnimate().align("cx").endAnimate();
    await sd.pause();
    grid.startAnimate().align("mx").endAnimate();
    await sd.pause();
    grid.startAnimate().align("x").endAnimate();
    await sd.pause();
    grid.startAnimate().axis("col").endAnimate();
    await sd.pause();
    grid.startAnimate().align("cy").endAnimate();
    await sd.pause();
    grid.startAnimate().align("my").endAnimate();
}
