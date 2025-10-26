import * as sd from "@/sd";

const svg = sd.svg();
const locations = ["tl", "tc", "tr", "lt", "lc", "lb", "rt", "rc", "rb", "bl", "bc", "br"];

sd.init(() => {});

sd.main(TestLabelTarget);

async function TestLabelTarget() {
    const r1 = new sd.Rect(svg).x(100).y(100).width(60);
    const r2 = new sd.Rect(svg).x(300).y(100).width(100);
    const r3 = new sd.Rect(svg).x(200).y(300);
    const label = sd.Label(r1, "HSJ");
    await sd.pause();
    label.startAnimate().target(r2).endAnimate();
    await sd.pause();
    r2.startAnimate().dx(100).endAnimate();
    await sd.pause();
    label.startAnimate().target(r3).endAnimate();
}

async function TestBasic(params) {
    const rect = new sd.Rect(svg).x(100).y(100);
    const label = sd.Label(rect, "label", "tc");
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        label.startAnimate().location(locations[i]).endAnimate();
    }
}
