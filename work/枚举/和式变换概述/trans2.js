import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Mathjax(svg, "\\sum_{i=1}^3Ca_i");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate().text("Ca_1+Ca_2+Ca_3").center(center).endAnimate();
    await sd.pause();
    math.startAnimate().text("C(a_1+a_2+a_3)", { a_1: "a_1", a_2: "a_2", a_3: "a_3", C: "C" }).endAnimate();
    await sd.pause();
    math.startAnimate().text("C\\sum_{i=1}^3a_i", { "a_1+a_2+a_3": "\\sum_{i=1}^3a_i", "C": "C" }).center(center).endAnimate();
});
