import * as sd from "@/sd";

const svg = sd.svg();
const curve = new sd.Curve(svg).source(100, 200).target(200, 100).bending(-0.5).doubleArrow();

sd.init(() => {});

sd.main(async () => {});
