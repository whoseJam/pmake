import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const curveTypes = [
    sd.Bezier,
    sd.CircleCurve,
    sd.Curve,
    sd.VHBezier
];

sd.main(async () => {
    for (let i = 0; i < curveTypes.length; i++) {
        await sd.pause();
        const line = new curveTypes[i](svg);
        line.source(100, 100).target(300, 200);
        line.startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        line.startAnimate().fadeStoT().endAnimate().arrow(null);
    }
})
