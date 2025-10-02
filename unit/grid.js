import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestNAndM);

async function TestPushPrimaryAndSecondary() {
    const n = 5;
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i + 1; j++) {
            grid.insert(i, j, `${i},${j}`);
        }
    }
    await sd.pause();
    grid.startAnimate().pushSecondary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushPrimary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushSecondary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushPrimary(12).endAnimate();
    await sd.pause();
    grid.startAnimate().popSecondary().endAnimate();
}

async function TestAxisAndAlign() {
    let cnt = 0;
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
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

async function TestNAndM() {
    const grid1 = new sd.Grid(svg).n(3).m(3).x(100).y(100);
    const grid2 = new sd.Grid(svg).n(3).m(3).x(400).y(100);
    const grid3 = new sd.Grid(svg).m(3).n(3).x(700).y(100);
    const grid4 = new sd.Grid(svg).n(5).m(3).x(1000).y(100);
    await sd.pause();
    grid1.startAnimate().n(5).endAnimate();
    grid2.startAnimate().m(5).endAnimate();
    grid3.startAnimate().n(5).m(5).endAnimate();
    grid4.startAnimate().n(3).endAnimate();
}
