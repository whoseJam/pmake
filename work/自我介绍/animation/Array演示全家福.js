import *  as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const arr1 = new sd.Array(svg).start(1);
const arr2 = new sd.Stack(svg).start(1);
const arr3 = new sd.BarArray(svg).start(1);
const arr4 = new sd.Array(svg).start(1);

main();

async function main() {
    for (let i = 1; i <= 5; i++) {
        arr1.push(i);
        arr2.push(i);
        arr3.push(i);
    }
    arr1.x(100).y(100);
    arr2.x(350).y(100);
    arr3.x(440).y(100);
    arr4.x(100).my(arr2.my());
    await sd.pause();
    arr1.startAnimate();
    const e = arr1.dropElement(1);
    arr1.endAnimate();
    arr4.startAnimate()
        .pushFromExistElement(e)
        .endAnimate();
    await sd.pause();
    arr1.startAnimate();
    const v = arr1.dropValue(2);
    arr1.endAnimate();
    arr4.startAnimate()
        .pushFromExistValue(v)
        .endAnimate();
    await sd.pause();
}
