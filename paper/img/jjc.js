import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg).pushRow(1).pushRow(2).pushRow(3).pushRow(4).pushRow(5).pushRow(5).pushRow(5).pushRow(5).startN(1).startM(1);
const data = [
    [1, 1],
    [3, 2],
    [4, 5],
    [6, 3],
    [8, 5],
];

sd.init(() => {
    data.forEach(item => {
        const element = grid.element(item[0], item[1]);
        if (!element) return;
        const text = new sd.Text(grid, "√").center(element.center());
    });
});

sd.main(async () => {});
