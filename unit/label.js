import * as sd from "@/sd";

const svg = sd.svg();
const locations = ["tl", "tc", "tr", "lt", "lc", "lb", "rt", "rc", "rb", "bl", "bc", "br"]

sd.init(() => {

})

sd.main(async () => {
    const rect = new sd.Rect(svg);
    const label = sd.Label(rect, "label", "tc");
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        label.startAnimate().location(locations[i]).endAnimate();
    }
})