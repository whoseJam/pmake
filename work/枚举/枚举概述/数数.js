import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const colors = [C.red, C.green, C.blue];
const array = new sd.ValueArray(svg).elementWidth(60);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        array.push(new sd.Circle(svg).color(colors[sd.rand(0, colors.length - 1)]));
    }
});

sd.main(async () => {});
