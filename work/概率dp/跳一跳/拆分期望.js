import * as sd from "@/sd";

const svg = sd.svg();
const boxes = new sd.ValueArray(svg).elementWidth(60).start(1);
const data = [1, 2, 1, 1, 3, 2, 1, 3];
const n = data.length + 1;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        boxes.push(new sd.Box(svg));
    }
})

sd.main(async () => {
    
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        sd.Link(boxes.element(i - 1), boxes.element(i), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).triggerRule().startAnimate().pointStoT().endAnimate().arrow();
        if (data[i - 2] === 1) {
            Appear(sd.Aside(boxes.element(i), new sd.Mathjax(svg, "+1"), "bc", 10));
        }
        if (data[i - 2] === 2) {
            Appear(sd.Aside(boxes.element(i), new sd.Mathjax(svg, "+cnt"), "bc", 30));
        }
        if (data[i - 2] === 3) {
            Appear(sd.Aside(boxes.element(i), new sd.Mathjax(svg, "+cnt"), "bc", 30));
            Appear(sd.Aside(boxes.element(i), new sd.Mathjax(svg, "+y_i"), "bc", 50));
        }
    }
})

function Appear(element) {
    element.opacity(0).after(300).startAnimate().opacity(1).endAnimate();
}