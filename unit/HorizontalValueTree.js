import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestLink);

async function TestLink() {
    const tree = new sd.HorizontalValueTree(svg).root(1, randomNode()).cx(300).y(300);
    await sd.pause();
    tree.startAnimate()
        .freeze()
        .newNode(2, randomNode())
        .newNode(3, randomNode())
        .link(1, 2)
        .link(1, 3)
        .unfreeze()
        .endAnimate();
    await sd.pause();
    tree.startAnimate()
        .freeze()
        .newNode(4, randomNode())
        .newNode(5, randomNode())
        .link(3, 4)
        .link(3, 5)
        .unfreeze()
        .endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().newNode(6, randomNode()).link(5, 6).unfreeze().endAnimate();
    tree.startAnimate().freeze().newNode(7, randomNode()).link(3, 7).unfreeze().endAnimate();
}

function randomNode() {
    const types = [sd.Circle, sd.Rect];
    const element = new types[sd.rand(0, types.length - 1)](svg);
    element.color(C.random());
    return element;
}
