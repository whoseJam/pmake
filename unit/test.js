import * as sd from "slidew";

const svg = sd.svg();
const C = sd.color();
const rect = new sd.Rect(svg);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    rect.startAnimate().x(100).endAnimate(); // 将 rect 的 x 坐标设置为 100
    await sd.pause();
    rect.startAnimate().dx(100).endAnimate(); // 将 rect 的 x 坐标增大 100
    await sd.pause();
    rect.startAnimate().scale(2).endAnimate(); // 将 rect 扩大至原来的两倍
    await sd.pause();
    appear(new sd.Circle(svg).r(3).color(C.red).center(rect.x(), rect.y())); // 在 rect 的 (x, y) 处新建一个红点
    await sd.pause();
    appear(new sd.Circle(svg).r(3).color(C.blue).center(rect.center())); // 在 rect 的中心处新建一个蓝点
    await sd.pause();
    appear(new sd.Circle(svg).r(3).color(C.green).center(rect.pos("mx", "cy"))); // 在 rect 的 (mx, y) 处新建一个绿点
    await sd.pause();
    appear(new sd.Circle(svg).r(3).color(C.orange).center(rect.pos("x", "y", 10, 10))); // 在 rect 的 (x + 10, y + 10) 处新建一个橙点
});

function appear(object) {
    object.opacity(0).startAnimate().opacity(1).endAnimate();
}
