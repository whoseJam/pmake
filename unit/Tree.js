import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();

sd.main(TestChangeRoot);

async function TestChangeRoot() {
    const tree = new sd.Tree(svg).x(100).y(100);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5).link(5, 6);
    tree.forEachNode((node, i) => {
        node.onClick(() => {
            sd.inter(async () => {
                tree.startAnimate().root(i).endAnimate();
            });
        });
    });
}

async function TestErrorStructure() {
    const tree = new sd.Tree(svg).x(100).y(100).layerGap(100);
    const focus = sd.Focus(tree).focus(tree);
    tree.link(1, 2).link(3, 4);
    await sd.pause();
    tree.startAnimate().link(1, 3).endAnimate();
    await sd.pause();
    tree.startAnimate().cut(3, 4).link(2, 4).endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().erase(2, 4).erase(4).unfreeze().endAnimate();
}

async function TestLayout() {
    const tree = new sd.Tree(svg).root(1).cx(600).y(100);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5).link(3, 6);
    sd.Focus(tree).focus();
    await sd.pause();
    tree.startAnimate().layout("horizontal").endAnimate();
}

async function TestLink() {
    const tree = new sd.Tree(svg).root(1).cx(600).y(100);
    await sd.pause();
    tree.startAnimate().freeze().link(1, 2).link(1, 3).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().link(5, 6).endAnimate();
    tree.startAnimate().link(3, 7).endAnimate();
}
