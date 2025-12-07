import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestBorderRadius);

async function TestStrokeDashArray() {
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
    }).setStrokeWidth(3);
    await sd.pause();
    rect.startAnimate().setStrokeDashArray([10, 10]).endAnimate();
    await sd.pause();
    rect.startAnimate().setStrokeDashArray([10, 0]).endAnimate();
}

async function TestBorderRadius() {
    const rect = new sd.Rect({
        targetNode: svg,
    })
        .setWidth(200)
        .setHeight(150)
        .setCenterX(600)
        .setCenterY(300);
    await sd.pause();
    rect.startAnimate().setBorderRadius(20).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(50).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(75).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(0).endAnimate();
}
