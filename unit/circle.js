import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

sd.main(TestCircleHTMLAndSVG);

async function TestCircleHTMLAndSVG() {
    console.log("hello 1");
    const c1 = new sd.Circle(div).cx(600).cy(300);
    const c2 = new sd.Circle(svg).cx(700).cy(300);
    await sd.pause();
    console.log("hello 2");
    c1.startAnimate().r(40).cx(600).cy(300).endAnimate();
    c2.startAnimate().r(40).endAnimate();
    await sd.pause();
    console.log("hello 3");
    c1.startAnimate().x(100).y(100).endAnimate();
    c2.startAnimate().x(200).y(100).endAnimate();
    for (let i = 1; i <= 30; i++) {
        await sd.pause();
        console.log(i);
    }
    throw new Error("I come here");
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
