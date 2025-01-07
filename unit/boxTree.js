import * as sd from "@/sd";

const svg = sd.svg();
const t = new sd.BoxTree(svg);

sd.init(() => {});

sd.main(TestBoxTreeBasic);

async function TestBoxTreeBasic() {
    t.cx(600).y(100).root(1);

    await sd.pause();
    t.startAnimate().freeze().link(1, 2).link(1, 3).unfreeze().endAnimate();

    await sd.pause();
    t.startAnimate().freeze().link(2, 4).link(2, 5).unfreeze().endAnimate();

    await sd.pause();
    t.startAnimate().freeze().elementWidth(120).elementHeight(60).unfreeze().endAnimate();

    await sd.pause();
    t.startAnimate().layerHeight(100).endAnimate();

    await sd.pause();
    t.startAnimate().freeze().link(3, 6).link(3, 7).unfreeze().endAnimate();
}
