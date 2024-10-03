import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(10);

sd.init(() => {

})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().push().push().endAnimate();
})