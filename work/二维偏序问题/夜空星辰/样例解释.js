import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 2],
    [3, 1],
    [5, 3],
    [2, 7],
    [4, 9],
    [10, 5],
    [8, 4],
    [7, 6],
];
const w = 60;
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);

sd.init(() => {
    sd.Label(plane.axis("x"), "x轴", "rc");
    sd.Label(plane.axis("y"), "y轴", "tc");
});

sd.main(async () => {});
