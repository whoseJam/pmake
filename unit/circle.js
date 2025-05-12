import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

sd.main(TestCircleHTML);

async function TestCircleHTML() {
    const circle = new sd.CircleHTML(div).cx(600).cy(300);
    await sd.pause();
    circle.startAnimate().r(50).cx(600).cy(300).endAnimate();
}

async function TestBasic() {
    const circle = new sd.Circle(svg);
    await sd.pause();
    circle.startAnimate().x(100).y(100).endAnimate();
    // 移动 circle 至 (100, 100)
    await sd.pause();
    circle.startAnimate().r(40).endAnimate();
    // 修改 circle 的半径为 40
}
