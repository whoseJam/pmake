import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const math = new sd.Mathjax(svg, "f_i=\\mathop{min}\\limits_{j\\lt i}\\{f_{j}+v_iv_{j}\\}")

sd.init(() => {

})

sd.main(async () => {
    const label = [1,2,3,"i-2","i-1"];
    for (let i = 0; i < label.length; i++) {
        await sd.pause();
        math.startAnimate().transformMath(`f_i=\\mathop{min}\\limits_{}\\{f_{${label[i]}}+v_iv_{${label[i]}}\\}`, {2:2,3:3,4:4}).endAnimate();
    }
    await sd.pause();
    math.startAnimate().transformMath(`{f_i}={f_{j_0}}+{v_i}{v_{j_0}}`).endAnimate();
    await sd.pause();
    math.element(1).startAnimate().color(C.red).endAnimate();
    math.element(2).startAnimate().color(C.textBlue).endAnimate();
    math.element(4).startAnimate().color(C.red).endAnimate();
    math.element(5).startAnimate().color(C.textBlue).endAnimate();
    await sd.pause();
    const b = math.createMath(1)//.color(C.red);
    const y = math.createMath(2)//.color(C.textBlue);
    const k = math.createMath(4)//.color(C.red);
    const x = math.createMath(5)//.color(C.textBlue);
    b.startAnimate().dy(50).transformMath("b").endAnimate();
    y.startAnimate().dy(50).transformMath("y").endAnimate();
    k.startAnimate().dy(50).transformMath("k").endAnimate();
    x.startAnimate().dy(50).transformMath("x").endAnimate();
})
