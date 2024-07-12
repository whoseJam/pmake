import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const stack = new sd.Stack(svg).start(1);
const data = [
    [1, 2], [2, 3],
    [3, 4], [3, 5],
    [4, 6], [5, 7],
];

init();
main();

function init() {
    tree.root(1);
    data.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).strokeWidth(2);
    })
    sd.Link(tree.element(6), tree.element(1), sd.Curve).bending(-0.6).arrow();
    sd.Link(tree.element(7), tree.element(3), sd.Curve).bending(1).arrow();
    tree.cx(600).cy(300);
    tree.element(3).stroke(C.red).strokeWidth(3);
    stack.push(1).push(2).push(3).push(4).push(6).push(5).push(7);
    stack.x(tree.mx() + 50).y(tree.y() - 20);
}

async function main() {
    for (let i = 1; i <= 2; i++) {
        await sd.pause();
        stack.startAnimate().color(stack.end(), C.blue).endAnimate();
        await sd.pause();
        const u = stack.intValue(stack.end());
        tree.startAnimate().color(u, C.blue).endAnimate();
        await sd.pause();
        stack.startAnimate().pop().endAnimate();
    }
    await sd.pause();
    stack.startAnimate().color(4, 5, C.grey).endAnimate();
    tree.startAnimate().color(4, C.grey).color(6, C.grey).endAnimate();
    await sd.pause();
    tree.startAnimate().color(3, C.blue).endAnimate();
    await sd.pause();
}