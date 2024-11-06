import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(400).layerHeight(80);
const m = 5;
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    })
    tree.forEachNodes((node, tid) => {
        node.childAs("arr", new sd.Array(node).start(1).elementWidth(15).elementHeight(15).resize(m), R.aside("tc"));
    })
})

sd.main(async () => {
    await sd.pause();
    tree.element(4).child("arr").startAnimate().value(2, +3).endAnimate();
    tree.element(5).child("arr").startAnimate().value(2, +3).endAnimate();
    tree.element(3).child("arr").startAnimate().value(2, -3).endAnimate();
    tree.element(1).child("arr").startAnimate().value(2, -3).endAnimate();
})