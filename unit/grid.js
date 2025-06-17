import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestDrop);

async function TestDrop() {
    const grid1 = new sd.Grid(svg).insert(0, 0, 1).insert(0, 1, 2).insert(0, 2, 3);
    const grid2 = new sd.Grid(svg).y(100).insert(0, 0, "A").insert(0, 1, "B").insert(0, 2, "C");
    function swapByValue(x) {
        grid1.startAnimate();
        grid2.startAnimate();
        const v1 = grid1.dropValue(0, x);
        const v2 = grid2.dropValue(0, x);
        grid1.element(0, x).valueFromExist(v2);
        grid2.element(0, x).valueFromExist(v1);
        grid1.endAnimate();
        grid2.endAnimate();
    }
    function swapByElement(x) {
        grid1.startAnimate();
        grid2.startAnimate();
        const e1 = grid1.dropElement(0, x);
        const e2 = grid2.dropElement(0, x);
        grid1.insertFromExistElement(0, x, e2);
        grid2.insertFromExistElement(0, x, e1);
        grid1.endAnimate();
        grid2.endAnimate();
    }
    await sd.pause();
    swapByValue(2);
    await sd.pause();
    swapByElement(1);
}

async function TestInsert() {
    const svg = sd.svg();
    const grid = new sd.Grid(svg).n(1).m(3);
    const value1 = new sd.Circle(svg).cx(grid.element(0, 0).cx()).cy(120);
    const value2 = new sd.Text(svg, "A").cx(grid.element(0, 1).cx()).cy(120);
    const value3 = new sd.Box(svg, "B").cx(grid.element(0, 2).cx()).cy(120);
    await sd.pause();
    grid.startAnimate().insert(1, 0, value1).endAnimate();
    await sd.pause();
    grid.startAnimate().insertFromExistValue(1, 1, value2).endAnimate();
    await sd.pause();
    grid.startAnimate().insertFromExistElement(1, 2, value3).endAnimate();
}

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
    grid.startAnimate().pushSecondary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushPrimary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushSecondary().endAnimate();
    await sd.pause();
    grid.startAnimate().pushPrimary(12).endAnimate();
    await sd.pause();
    grid.startAnimate().popSecondary().endAnimate();
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
