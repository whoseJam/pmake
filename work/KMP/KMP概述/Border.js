import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).pushArray("abababa").start(1);

const rangeF = sd.Brace(arr);
const rangeB = sd.Brace(arr);

sd.init(() => {

})

sd.main(async () => {
    await getBorder(3);
    await getBorder(5);
})

async function getBorder(len) {
    await sd.pause();
    rangeF.startAnimate().brace(1, len, "t").endAnimate();
    rangeB.startAnimate().brace(arr.length() - len + 1, arr.length(), "b").endAnimate();
}