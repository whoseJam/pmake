import * as sd from "@/sd";

const svg = sd.svg();
const t = new sd.BoxTree(svg);

sd.init(() => {});

sd.main(TestLink);

async function TestBoxTreeBasic() {
    t.cx(600).y(100).root(1);
    sd.Focus(t).focus();
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
    await sd.pause();
    t.startAnimate().layout("horizontal").endAnimate();
    await sd.pause();
    t.startAnimate().root(7).endAnimate();
}

async function TestLayout() {
    const tree = new sd.BoxTree(svg).root(1).cx(600).y(100);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5).link(3, 6);
    sd.Focus(tree).focus();
    await sd.pause();
    tree.startAnimate().layout("horizontal").endAnimate();
}

async function TestLink() {
    const tree = new sd.BoxTree(svg).root(1).cx(600).y(100);
    await sd.pause();
    tree.startAnimate().freeze().link(1, 2).link(1, 3).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().link(5, 6).endAnimate();
    tree.startAnimate().link(3, 7).endAnimate();
}
