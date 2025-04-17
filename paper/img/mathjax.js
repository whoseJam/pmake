import * as sd from "@/sd";

const svg = sd.svg();
const tick = 6;
const text = new sd.Mathjax(svg, "A_1").x(100).y(100);
const width = text.width();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();

    for (let i = 0; i <= tick; i++) {
        setTimeout(() => {
            const m = Snap.fragment(text._.transforming[0].element.outerHTML);
            const svg = m.select("svg");
            svg.attr({
                x: 100 + i * 50,
                y: 150,
            });
            Snap("svg").append(m);
        }, i * 1000);
        if (i < tick) {
            const link = new sd.Curve(svg).bending(-0.3);
            const offset = 5;
            link.source(100 + i * 50 + width / 2 + offset, 148);
            link.target(150 + i * 50 + width / 2 - offset, 148);
            link.markerEnd("adaptiveArrow").strokeWidth(0.75);
        }
    }
    text.startAnimate(tick * 1000)
        .transformMath("A_2")
        .endAnimate();
});
