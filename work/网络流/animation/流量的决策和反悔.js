import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const v1 = new sd.Vertex(svg).cx(100).cy(100);
const v2 = new sd.Vertex(svg).cx(400).cy(100);
const lineO = sd.Link(v1, v2);
const lineI = sd.Link(v1, v2);

sd.init(() => {
    lineO.strokeWidth(10).stroke(C.grey);
    lineI.strokeWidth(5).stroke(C.red);
    const L = lineI.totalLength();
    lineI.strokeDashArray([L, L]);
    lineI.strokeDashOffset(L);
});

sd.main(async () => {
    const piece = lineI.totalLength() / 10;
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 9)
        .endAnimate();
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 5)
        .endAnimate();
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 2)
        .endAnimate();
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 7)
        .endAnimate();
});
