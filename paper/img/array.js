import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(100).y(100);
arr.push(new sd.Circle(svg).color(C.blue));
arr.push("A");
arr.push("1");

sd.init(() => {});

sd.main(async () => {});
