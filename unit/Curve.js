import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestBending);

async function TestSourceAndTarget() {
    const curve = new sd.Curve(svg);
    curve.source(100, 100).target(300, 200).strokeWidth(2);
    await sd.pause();
    curve.startAnimate().source(150, 150).endAnimate();
    await sd.pause();
    curve.startAnimate().target(400, 300).endAnimate();
    await sd.pause();
    curve.startAnimate().source(50, 50).target(350, 150).endAnimate();
    await sd.pause();
    curve.startAnimate().source(100, 300).target(400, 100).endAnimate();
}

async function TestBending() {
    const curves = [];
    const bendings = [-0.5, -0.25, 0, 0.25, 0.5];
    const colors = [C.red, C.orange, C.green, C.blue, C.purple];
    for (let i = 0; i < bendings.length; i++)
        curves.push(
            new sd.Curve(svg)
                .source(100, 100 + i * 30)
                .target(400, 100 + i * 30)
                .bending(bendings[i])
                .strokeWidth(2)
                .stroke(colors[i])
        );
    await sd.pause();
    for (let i = 0; i < curves.length; i++) {
        curves[i]
            .startAnimate()
            .bending(bendings[bendings.length - 1 - i])
            .endAnimate();
    }
    await sd.pause();
    for (let i = 0; i < curves.length; i++) curves[i].startAnimate().bending(bendings[i]).endAnimate();
}
