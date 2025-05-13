import * as sd from "@/sd";

const C = sd.color();
const svg = sd.svg();
const div = sd.div();
const canvas = new sd.Canvas(div).three();
const camera = canvas.camera();

sd.init(() => {});

sd.main(TestRect);

async function TestRect() {
    const r1 = new sd.Rect3D(canvas);
    console.log(r1.x(), r1.y());
    const r2 = new sd.Rect(svg).x(100).y(100);
    const r3 = new sd.Rect(div).x(100).y(150);
    await sd.pause();
    r1.startAnimate().width(2).endAnimate();
    await sd.pause();
    r1.startAnimate().x(1).endAnimate();
}

async function TestCircle() {
    const c1 = new sd.Circle3D(canvas);
    const c2 = new sd.Circle(svg).x(100).y(100);
    const c3 = new sd.Circle(div).x(100).y(150);
    await sd.pause();
    c1.startAnimate().r(2).endAnimate();
    await sd.pause();
    c1.startAnimate().x(1).endAnimate();
}
