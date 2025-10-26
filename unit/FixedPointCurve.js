import * as sd from "@/sd";

const svg = sd.svg();

// const fix = new sd.FixedPointCurve(svg);

// fix.source([100, 200]).target([200, 100]).fixedPoint([100, 100]);

const v1 = new sd.Vertex(svg).cx(100).cy(200);
const v2 = new sd.Vertex(svg).cx(200).cy(100);
sd.Link(v1, v2, sd.FixedPointCurve).fixedPoint([100, 100]);
v1.update();

main();

async function main() {
    await sd.pause();
}