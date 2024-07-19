import * as sd from "@/sd";

const svg = sd.svg();

const slider = new sd.Slider(svg);
slider.onChanged((value) => {
    console.log("slider is changed value = ", value);
})

main();

async function main() {
    await sd.pause();
    slider.startAnimate().max(100).width(200).endAnimate();
    await sd.pause();
    slider.startAnimate().height(100).endAnimate();
    await sd.pause();
}