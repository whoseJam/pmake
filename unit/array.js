import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();

sd.init(() => {});

sd.main(TestArrayInitWithFreeze);

async function TestArrayInitWithFreeze() {
    const arr = new sd.Array(svg).x(100).y(100);
    await sd.pause();
    arr.startAnimate();
    sd.freeze();
    arr.resize(3);
    sd.unfreeze();
    arr.endAnimate();
}

async function TestTwoArrayMoveValue() {
    const n = 10;
    const arr1 = new sd.Array(svg).resize(n).x(100).y(100);
    const arr2 = new sd.Array(svg).x(100).y(200);
    for (let i = 0; i < n; i++) arr1.value(i, new sd.Mathjax(arr1, i));
    await sd.pause();
    for (let i = 0; i < n; i++) {
        arr2.startAnimate(10000);
        arr2.push();
        arr2.element(i).value(arr1.element(i).drop().onEnter(EN.moveTo()));
        arr2.endAnimate();
    }
}

async function main() {
    const arr = new sd.Array(svg).x(800).y(100);
    arr.push(1).push(2).push(3);
    await sd.pause();
    arr.startAnimate();
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

    const a1 = new sd.Array(svg).x(100).y(100).push(1).push(2).push(3);
    const a2 = new sd.Array(svg).x(100).y(150).push(4).push(5).push(6);
    await sd.pause();
    const e1 = a1.dropElement(2);
    a2.startAnimate().pushFromExistElement(e1).endAnimate();
    await sd.pause();

    const a3 = new sd.Array(svg).x(100).y(220).push(1).push(2).push(3);
    const a4 = new sd.Array(svg).x(100).y(270).push(4).push(5).push(6);
    await sd.pause();
    const e3 = a3.dropValue(2);
    a4.startAnimate().pushFromExistValue(e3).endAnimate();
    await sd.pause();

    const a5 = new sd.Array(svg).x(400).y(100).push(1).push(2).push(3);
    const a6 = new sd.Array(svg).x(400).y(150).push(4).push(5).push(6);
    await sd.pause();
    const e5 = a5.startAnimate().dropValue(2).endAnimate();
    a6.startAnimate().pushFromExistValue(e5).endAnimate();
    await sd.pause();
    a6.startAnimate().sort().endAnimate();
}
