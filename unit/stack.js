import * as sd from "@/sd";

const svg = sd.svg();

main();

async function main() {
    const arr = new sd.Stack(svg).x(800).y(100);
    arr.push(1).push(2).push(3).push(4);
    await sd.pause();
    arr.startAnimate()
    arr.insert(1, "+2");
    arr.insert(4, "+1");
    arr.endAnimate();
    arr.startAnimate();
    arr.insert(3, "inf");
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate().erase(2).endAnimate();
    arr.startAnimate().erase(3).endAnimate();
    await sd.pause();

    const a1 = new sd.Stack(svg).x(100).y(100).push(1).push(2).push(3);
    const a2 = new sd.Stack(svg).x(180).y(100).push(4).push(5).push(6);
    await sd.pause();
    const e1 = a1.dropElement(2);
    a2.startAnimate().pushFromExistElement(e1).endAnimate();
    await sd.pause();

    const a3 = new sd.Stack(svg).x(100).y(300).push(1).push(2).push(3);
    const a4 = new sd.Stack(svg).x(180).y(300).push(4).push(5).push(6);
    await sd.pause();
    const e3 = a3.dropValue(2);
    a4.startAnimate().pushFromExistValue(e3).endAnimate();
    await sd.pause();

    const a5 = new sd.Stack(svg).x(400).y(100).push(1).push(2).push(3);
    const a6 = new sd.Stack(svg).x(480).y(100).push(4).push(5).push(6);
    await sd.pause();
    const e5 = a5.startAnimate().dropValue(2).endAnimate();
    a6.startAnimate().pushFromExistValue(e5).endAnimate();
    await sd.pause();
    a6.startAnimate().sort().endAnimate();

}