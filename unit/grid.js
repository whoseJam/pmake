import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);

sd.init(() => {
    let code = 97;
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= i; j++) {
            grid.insert(i, j, String.fromCharCode(code));
            code++;
        }
    }
    sd.Focus(grid).focus();
})

sd.main(async () => {
    await sd.pause();
    grid.startAnimate().align("mx").endAnimate();
    await sd.pause();
    grid.startAnimate().align("y").axis("col").endAnimate();
    await sd.pause();
    grid.startAnimate().align("my").endAnimate();
    await sd.pause();
    grid.startAnimate().width(500).endAnimate();
    await sd.pause();
    grid.startAnimate().insert(4, 5, "A").endAnimate();
    await sd.pause();
    grid.startAnimate().insert(4, 6, "B").endAnimate();
})