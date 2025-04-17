import * as sd from "@/sd";

const svg = sd.svg();
const rect = new sd.Rect(svg);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    rect.startAnimate().x(200).endAnimate();
    rect.after(150).startAnimate().x(0).endAnimate();
});
