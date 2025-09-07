import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestBasic);

async function TestBasic() {
    const circle = new sd.Circle(svg);
    await sd.pause();
    circle.startAnimate().x(100).y(100).endAnimate();
    // 移动 circle 至 (100, 100)
    await sd.pause();
    circle.startAnimate().r(40).endAnimate();
    // 修改 circle 的半径为 40
}
