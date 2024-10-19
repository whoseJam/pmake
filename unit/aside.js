import * as sd from "@/sd";

const svg = sd.svg();
const box = new sd.Rect(svg).x(100).y(100).height(300).width(500);
const text = sd.Aside(box, new sd.Text(box, "Hello"), "tc", 5);


sd.init(() => {

})

sd.main(async () => {
    const locations = [
        "lt", "lc", "lb",
        "tl", "tc", "tr",
        "rt", "rc", "rb",
        "bl", "bc", "br"
    ];
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        text.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    text.startAnimate().gap(20).endAnimate();
})