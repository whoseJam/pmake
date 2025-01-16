import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const slider = new sd.Slider(div);
const rect = new sd.Rect(svg);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    new sd.Rect(svg);
    slider.startAnimate().dx(100).dy(100).endAnimate();
    rect.startAnimate().dx(100).dy(100).endAnimate();
});
