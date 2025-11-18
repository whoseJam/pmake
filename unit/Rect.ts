import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestStrokeDashArray);

async function TestStrokeDashArray() {
    const rect = new sd.Rect(svg).strokeWidth(3).x(100).y(100).width(100).height(100);
    await sd.pause();
    rect.startAnimate().strokeDashArray([10, 10]).endAnimate();
    await sd.pause();
    rect.startAnimate().strokeDashArray([10, 0]).endAnimate();
}

async function TestBorderRadius() {
    const rect = new sd.Rect(svg).cx(600).cy(300).width(200).height(150);
    await sd.pause();
    rect.startAnimate().borderRadius(20).endAnimate();
    await sd.pause();
    rect.startAnimate().borderRadius(50).endAnimate();
    await sd.pause();
    rect.startAnimate().borderRadius(75).endAnimate();
    await sd.pause();
    rect.startAnimate().borderRadius(0).endAnimate();
}
