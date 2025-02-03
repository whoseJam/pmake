import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).viewBox(-3, -3, 13, 13).width(600).height(300);
const data = [
    [3, 5],
    [-1, 2],
    [6, -2],
    [0, 7],
    [4, 1],
    [-2, -1],
    [7, 3],
    [2, 6],
    [5, -2],
    [1, 4],
];

sd.init(() => {
    data.forEach(([x, y]) => {
        new sd.Circle(svg).color(C.blue).r(6).center(coord.globalAt(x, y));
    });
});

sd.main(async () => {});
