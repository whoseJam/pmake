import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestLink);

async function TestLink() {
    const tree = new sd.HorizontalTree(svg).root(1).cx(600).y(100);
    await sd.pause();
    tree.startAnimate().freeze().link(1, 2).link(1, 3).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().link(5, 6).endAnimate();
    tree.startAnimate().link(3, 7).endAnimate();
}
