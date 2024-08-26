import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr1 = new sd.Array(svg).resize(4);
const arr2 = new sd.Array(svg).resize(4);
const colors = [C.white, C.green, C.blue, C.red];
const n = 3;

sd.init(() => {
    arr2.x(arr1.mx());
    for (let i = 0; i < arr1.length(); i++) {
        let tmp1 = 0;
        let tmp2 = 0;
        arr1.element(i).onClick(() => {
            arr1.color(i, colors[(++tmp1) % colors.length]);
        });
        arr2.element(i).onClick(() => {
            arr2.color(i, colors[(++tmp2) % colors.length]);
        })
    }
});

sd.main(async () => {
    await sd.pause();
    arr1.startAnimate().dx(-20).endAnimate();
    arr2.startAnimate().dx(20).endAnimate();
});