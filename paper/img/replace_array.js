import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const arr1 = new sd.Array(svg).resize(5).x(100).y(100);
arr1.opacity(0.5);
const arr2 = new sd.Array(svg).resize(5).x(250).y(200);
arr1.element(4).value(new sd.Mathjax(svg, "e_1"), R.centerOnly());
arr2.element(4).value(new sd.Mathjax(svg, "e_2"), R.centerOnly());

lineArray("x", "y");
lineArray("x", "my");
lineArray("mx", "my");
lineArray("mx", "y");

sd.init(() => {});

sd.main(async () => {});

function lineArray(x, y) {
    line(arr1.pos(x, y), arr2.pos(x, y));
}

function line(a, b) {
    new sd.Line(svg).source(a).target(b).opacity(0.5).strokeDashArray([5, 5]);
}
