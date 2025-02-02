import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestBasic);

async function TestBasic() {
    const t = new sd.Tree(svg);
    t.root(1).cx(600).y(100);
    await sd.pause();
    t.startAnimate().freeze();
    t.link(1, 2);
    t.link(1, 3);
    t.unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().width(100).endAnimate();
}
