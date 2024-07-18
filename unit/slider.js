import * as sd from "@/sd";

const svg = sd.svg();

const slider = new sd.Slider(svg);
slider.onChanged((value) => {
    console.log("slider is changed value = ", value);
})
console.log(slider._.nake.children);