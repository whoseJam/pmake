import * as sd from "@/sd";

const svg = sd.svg();
const box = new sd.Rect(svg).x(100).y(100).height(300).width(500);
const text = new sd.Text(box, "hello");
const aside = sd.Aside(box, text, "tc", 5);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    aside.startAnimate().text("world").endAnimate();
    const locations = ["lt", "lc", "lb", "tl", "tc", "tr", "rt", "rc", "rb", "bl", "bc", "br"];
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        aside.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    aside.startAnimate().gap(20).endAnimate();
});
