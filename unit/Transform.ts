import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestTransformOrigin);

async function TestTransformOrigin() {
    const rect = new sd.Rect(svg).x(100).y(100).transformOrigin(120, 120);
    await sd.pause();
    rect.startAnimate().rotate(45).endAnimate();
    rect.startAnimate().scale(2).endAnimate();
}

async function TestRotate() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().rotate(45).endAnimate();
}

async function TestScale() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().scale(2, 2).endAnimate();
}

async function TestTranslate() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().translate(100, 100).endAnimate();
}
