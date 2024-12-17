import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const i = 7;
const str = " accbabbaac"
const banned = "c";
const arr = new sd.Array(svg).x(100).y(200).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "i", "b", 3, 20, 3).moveTo(i);
    sd.Brace(arr).brace(1, i, "b").value("合法");
})

sd.main(async () => {
    await sd.pause();
    for (let j = 1; j < i; j++) {
        sd.Link(arr.element(j), arr.element(i), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).startAnimate().pointStoT().endAnimate().arrow();
    }
    await sd.pause();
    arr.startAnimate();
    for (let j = 1; j <= n; j++) arr.value(j, str[j]);
    arr.endAnimate();

    await sd.pause();
    arr.startAnimate();
    for (let j = 1; j <= i; j++) arr.color(j, (str[j] === banned) ? C.red : C.green);
    arr.endAnimate();
})