import * as sd from "@/sd";

const svg = sd.svg();
const data = [0, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, 0, 0];
const arr1 = new sd.Array(svg).x(100);
const arr2 = new sd.Array(svg).x(100).y(80);
const arr3 = new sd.Array(svg).x(100).y(160);

sd.init(() => {
    data.forEach(d => arr1.push(d));
});

sd.main(async () => {
    await sd.pause();
    const d1 = Dlt(data);
    sd.Label(arr2, "一次差分").opacity(0).startAnimate().opacity(1).endAnimate();
    d1.forEach(d => arr2.startAnimate().push(d).endAnimate());
    await sd.pause();
    const d2 = Dlt(d1);
    sd.Label(arr3, "二次差分").opacity(0).startAnimate().opacity(1).endAnimate();
    d2.forEach(d => arr3.startAnimate().push(d).endAnimate());
});

function Dlt(arr) {
    let newArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        newArr[i] = arr[i] - arr[i - 1];
    }
    return newArr;
}
