import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
// const v1 = new sd.Rect(svg).center(100, 300);
// const v2 = new sd.Rect(svg).center(700, 400);
const arr = new sd.Array(svg).x(100).y(400).resize(n).start(1);

sd.init(() => {});

sd.main(async () => {
    // await sd.pause();
    // const type = sd.ZZLine;
    // const x1 = "cx";
    // const y1 = "cy";
    // const x2 = "cx";
    // const y2 = "cy";
    
    // sd.Link(v1, v2, type, x1, y1, x2, y2).stroke(C.red);
    // new type(svg).source(v1.pos(x1, y1, 0, -1)).target(v2.pos(x2, y2, 0, -1));

    for (let i = 1; i <= n - 1; i++) {
        // const curve = new sd.Curve(svg);
        // curve.bending(-0.5);
        // curve.source(arr.element(i).pos("cx", "y"));
        // curve.target(arr.element(n).pos("cx", "y"));
        // curve.startAnimate(1000).pointStoT().endAnimate().arrow();
        sd.Link(arr.element(i), arr.element(n), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).startAnimate(1000).pointStoT().endAnimate().arrow();
    }
});
