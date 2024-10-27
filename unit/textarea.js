import * as sd from "@/sd";

const svg = sd.svg();
const textarea = new sd.TextArea(svg).x(100).y(100);
const button = new sd.Button(svg).cx(textarea.cx()).y(textarea.my());

button.onClick(() => {
    console.log(textarea.value());
})

sd.main(async () => {
    await sd.pause();
    textarea.startAnimate().scale(2).endAnimate();
})