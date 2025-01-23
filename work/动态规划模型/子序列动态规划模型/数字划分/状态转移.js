import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const s = new sd.Array(svg);
const f = new sd.Array(svg).y(s.my());
const zeroIndex = [4, 6, 9];

sd.init(() => {
    sd.Label(f, "f", "lc");
    sd.Label(s, "s", "lc");
    for (let i = 0; i <= n; i++) {
        s.push()
            .lastElement()
            .value(new sd.Mathjax(s, `s_{${i}}`), R.centerOnly());
        f.push()
            .lastElement()
            .value(new sd.Mathjax(f, `f_{${i}}`), R.centerOnly());
    }
});

sd.main(async () => {
    await sd.pause();
    s.element(0).value().startAnimate().transformMath("0").endAnimate();
    f.element(0).value().startAnimate().transformMath("1").endAnimate();

    await sd.pause();
    zeroIndex.forEach(idx => {
        const box = s.element(idx);
        box.startAnimate();
        box.color(C.green);
        box.value().transformMath("0");
        box.endAnimate();
        f.element(idx).startAnimate().color(C.green).endAnimate();
        sd.Link(f.element(0), f.element(idx), sd.Curve, "cx", "my", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();
    });
});
