import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestLink);

async function TestBasic() {
    const t = new sd.ValueTree(svg).cx(600).y(50).layerHeight(120);
    t.root(1, new sd.Array(svg).push(1).push(2).push(3));
    await sd.pause();
    t.startAnimate().freeze().newNode(2, new sd.Grid(svg).n(3).m(3)).newLink(1, 2).unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().freeze().newNode(3, new sd.Math(svg, `A^2+B^2=C^2`)).newLink(1, 3).unfreeze().endAnimate();
}

async function TestLink() {
    const tree = new sd.ValueTree(svg).root(1, randomNode()).cx(600).y(100);
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
