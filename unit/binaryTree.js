import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestLink);

async function TestAutoRoot() {
    const tree = new sd.BinaryTree(svg).cx(600).y(100);
    sd.Focus(tree).focus();
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5);
    await sd.pause();
    tree.startAnimate().layout("horizontal").endAnimate();
    await sd.pause();
    tree.startAnimate().layerGap(100).endAnimate();
    await sd.pause();
    tree.startAnimate().cut(2, 4).link(3, 4).endAnimate();
}

async function TestBasic() {
    const t1 = new sd.BinaryTree(svg).cx(600).y(100);
    const t2 = new sd.Tree(svg).cx(400).y(100);
    t1.root(1);
    t2.root(1);
    await sd.pause();
    t1.startAnimate().leftChild(1, 2).rightChild(1, 3).endAnimate();
    t2.startAnimate().link(1, 2).link(1, 3).endAnimate();
    await sd.pause();
    t1.startAnimate().leftChild(2, 4).endAnimate();
    await sd.pause();
    t1.startAnimate().rightChild(2, 5).endAnimate();
    await sd.pause();
    t1.startAnimate().leftChild(3, 6).endAnimate();
    t1.startAnimate().rightChild(3, 7).endAnimate();
    await sd.pause();
}

async function TestLink() {
    const tree = new sd.BinaryTree(svg).root(1).cx(600).y(100);
    await sd.pause();
    tree.startAnimate().freeze().link(1, 2).link(1, 3).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().link(5, 6).endAnimate();
    tree.startAnimate().link(3, 7).endAnimate();
}
