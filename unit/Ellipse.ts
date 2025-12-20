import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestEllipse);

async function TestEllipse() {
    const e = new sd.Ellipse({
        targetNode: svg,
        rx: 100,
        ry: 50,
        cx: 600,
        cy: 300,
    });
    await sd.pause();
    e.startAnimate().setRx(60).endAnimate();
}
