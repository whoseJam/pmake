import * as sd from "@/sd";

const svg = sd.svg();
const button = new sd.Button(svg).x(100).y(100);

button.onClick(() => {
    console.log(`click button ${button.text()}`);
});

sd.main(async () => {
    await sd.pause();
    button.startAnimate().scale(2).endAnimate();
    await sd.pause();
    button.startAnimate().text("Hello").endAnimate();
})
