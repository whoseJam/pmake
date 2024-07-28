import * as sd from "@/sd";

const svg = sd.svg();
const a = [5, 2, 7, 3];
const arr1 = new sd.Array(svg).x(100);
const arr2 = new sd.Array(svg).x(100).y(80);
const arr3 = new sd.Array(svg).x(100).y(160);
const arr4 = new sd.Array(svg).x(100).y(240);
const arr5 = new sd.Array(svg).x(100).y(320);

init();
main();

function init() {
    a.forEach(d => arr1.push(d));
    sd.Label(arr1, "原始数组");
}

async function main() {
    await sd.pause();
    sd.Label(arr2, "一次差分后");
    for (let i = 0; i < a.length; i++) {
        if (i > 0) arr2.startAnimate().push(a[i] - a[i-1]).endAnimate();
        else arr2.startAnimate().push(a[0]).endAnimate();
    }
    await sd.pause();
    sd.Label(arr3, "一次前缀和后");
    a.forEach(d => arr3.startAnimate().push(d).endAnimate());
    await sd.pause();
    sd.Label(arr4, "一次前缀和后");
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += a[i];
        arr4.startAnimate().push(sum).endAnimate();
    }
    await sd.pause();
    sd.Label(arr5, "一次差分后");
    a.forEach(d => arr5.startAnimate().push(d).endAnimate());
    await sd.pause();
}