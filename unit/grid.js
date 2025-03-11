import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestOutRangeInsert);

async function TestOutRangeInsert() {
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    grid.insert(2, 1, 1);
    grid.insert(1, 1, 2);
}

async function TestResetSize() {
    const n = 5;
    const grid = new sd.Grid(svg).x(100).y(100).m(n).n(n);
    await sd.pause();
    grid.startAnimate().n(3).endAnimate();
}

async function TestPushColAndRow() {
    const n = 5;
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i + 1; j++) {
            grid.insert(i, j, `${i},${j}`);
        }
    }
    await sd.pause();
    grid.startAnimate().pushCol().endAnimate();
    await sd.pause();
    grid.startAnimate().pushRow().endAnimate();
    await sd.pause();
    grid.startAnimate().pushCol().endAnimate();
    await sd.pause();
    grid.startAnimate().pushRow(12).endAnimate();
    await sd.pause();
    grid.startAnimate().popCol().endAnimate();
    console.log(grid.m(), grid.n());
}

async function TestDiffLayout() {
    const n = 5;
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i + 1; j++) {
            grid.insert(i, j, `${i},${j}`);
        }
    }
    await sd.pause();
    grid.startAnimate().align("cx").endAnimate();
    await sd.pause();
    grid.startAnimate().align("mx").endAnimate();
    await sd.pause();
    grid.startAnimate().axis("col").align("y").endAnimate();
    await sd.pause();
    grid.startAnimate().align("cy").endAnimate();
    await sd.pause();
    grid.startAnimate().align("my").endAnimate();
}

async function TestBasicGridFunctionality(params) {
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    let code = 97;
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= i; j++) {
            grid.insert(i, j, String.fromCharCode(code));
            code++;
        }
    }
    console.log(grid.n(), grid.m());
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
}
