import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const math = new sd.Mathjax(svg, "f_i=\\mathop{min}\\limits_{j\\lt i}\\{f_{j}+A_iB_{j}\\}");
const line = new sd.Line(svg).opacity(0);
const coord = new sd.Coord(svg).viewX(-5).viewWidth(15).viewY(-5).viewHeight(15).width(400).height(200).cx(math.cx()).y(70).opacity(0);
const convex = [3, 4, 6, 5, 7, 2]; 
let K = 1;
const data = [
    { x: 1, y: 2 },
    { x: 5, y: 6.5 },
    { x: -3, y: 6 },
    { x: -2, y: 1 },
    { x: 3, y: 0.5 },
    { x: -1.5, y: -1 },
    { x: 4, y: 2.5 },
    { x: 1.5, y: 5 },
    { x: 1, y: 8 }
]

const slider = new sd.Slider(svg).min(0).max(25).value(4).onChange((value) => {
    K = value * 0.05;
    sd.inter(async () => {
        const center = line.center();
        const start = [center[0] - 200, center[1] + 200 * K];
        const end = [center[0] + 200, center[1] - 200 * K];
        line.startAnimate().source(start).target(end).endAnimate();
    })
}).opacity(0);

sd.init(() => {
    sd.Label(slider, "$-A_i$");
    slider.width(80).mx(coord.mx()).my(coord.my());
})

sd.main(async () => {
    const label = [1,2,3,4,"i-2","i-1"];
    for (let i = 0; i < label.length; i++) {
        await sd.pause();
        math.startAnimate().transformMath(`f_i=\\mathop{min}\\limits_{}\\{f_{${label[i]}}+A_iB_{${label[i]}}\\}`, {2:2,3:3,4:4}).endAnimate();
    }
    await sd.pause();
    math.startAnimate().transformMath("{f_i}={f_{j_0}}+{A_i}{B_{j_0}}").endAnimate();
    await sd.pause();
    math.startAnimate().transformMath("{f_i}={f_{j_0}}-{(-A_i)}{B_{j_0}}", {1:1,2:2,4:4,5:5}).endAnimate();
    await sd.pause();
    math.element(1).startAnimate().color(C.red).endAnimate();
    math.element(2).startAnimate().color(C.textBlue).endAnimate();
    math.element(4).startAnimate().color(C.red).endAnimate();
    math.element(5).startAnimate().color(C.textBlue).endAnimate();
    await sd.pause();
    const b = math.createMath(1).color(C.red);
    const y = math.createMath(2).color(C.textBlue);
    const k = math.createMath(4).color(C.red);
    const x = math.createMath(5).color(C.textBlue);
    b.startAnimate().transformMath("b").my(50).endAnimate();
    y.startAnimate().transformMath("y").my(50).endAnimate();
    k.startAnimate().transformMath("k").my(50).endAnimate();
    x.startAnimate().transformMath("x").my(50).endAnimate();
    await sd.pause();
    coord.startAnimate().opacity(1).endAnimate();
    data.forEach((item, idx) => {
        item.circle = new sd.Circle(coord).r(2).color(C.black).center(coord.at(item.x, item.y)).strokeWidth(0).childAs(
            new sd.Mathjax(coord, `(B_{${idx+1}},f_{${idx+1}})`).fontSize(8),
            R.aside("tc", 2)
        );
    });
    await sd.pause();
    line.source([0, 0]).target(400, -80).cx(coord.cx()).my(coord.my()).startAnimate().opacity(1).endAnimate();
    line.childAs(new sd.Mathjax(line, "k=-A_i").fontSize(8), R.pointAtPathByRate(1, "cx", "my"));
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        const pos = coord.at(data[i].x, data[i].y);
        const k = (pos[0] - coord.x()) / (coord.width());
        const lineY = line.at(k)[1];
        const nodeY = pos[1];
        data[i].circle.startAnimate().color(C.red).endAnimate();
        line.startAnimate().dy(nodeY - lineY).endAnimate();
        await sd.pause();
        data[i].circle.startAnimate().color(C.black).endAnimate();
    }
    await sd.pause();
    line.drag((dx, dy) => { return [0, dy] })
    slider.opacity(1);
    await sd.pause();
    for (let i = 0; i + 1 < convex.length; i++) {
        const link = sd.Link(data[convex[i] - 1].circle, data[convex[i+1] - 1].circle, sd.Line, "cx", "cy", "cx", "cy")
            .opacity(0).stroke(C.red).after(i * 300).opacity(1).startAnimate().pointStoT().endAnimate();
    }
})
