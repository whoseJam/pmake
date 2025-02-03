import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [1, 2, -1, 5, 6];

sd.init(() => {
    new sd.Line(svg)
        .source(-3 * 20, 0)
        .target(8 * 20, 0)
        .arrow();
    data.forEach(value => {
        new sd.Circle(svg)
            .r(6)
            .center(value * 20, 0)
            .color(C.blue);
    });
});

sd.main(async () => {});
