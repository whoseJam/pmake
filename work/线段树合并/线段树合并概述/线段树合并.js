import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree1 = new sd.BinaryTree(svg).width(500);
const tree2 = new sd.BinaryTree(svg).dy(250).width(500);
const tree3 = new sd.BinaryTree(svg).dy(125).width(500).dx(500);
const pushUpText = new sd.Mathjax(svg, "pushUp(u)").opacity(0);
let tot = 0;

sd.init(() => {
    tree1.root(++tot); // 1
    tree1.leftChild(1, ++tot);
    tree1.leftChild(2, ++tot);
    tree1.rightChild(3, ++tot);
    tree1.rightChild(1, ++tot);
    tree1.leftChild(5, ++tot);
    tree1.leftChild(6, ++tot);

    tree2.root(++tot); // 8
    tree2.rightChild(8, ++tot);
    tree2.rightChild(9, ++tot);
    tree2.leftChild(10, ++tot);
    tree2.rightChild(10, ++tot);

    const plusOp = new sd.Text(svg, "+").fontSize(30).cx(tree1.cx()).cy((tree1.my() + tree2.y()) / 2);
    const equalOp = new sd.Text(svg, "=").fontSize(30).cx(tree1.mx()).cy(plusOp.cy());
})

sd.main(async () => {
    await Merge(1, 8)
})

const f1 = sd.Focus(tree1);
const f2 = sd.Focus(tree2);

async function Merge(rt1, rt2) {
    await sd.pause();
    f1.startAnimate().focus(rt1).endAnimate();
    f2.startAnimate().focus(rt2).endAnimate();
    if (rt1 === 1) {
        tree3.startAnimate().root(rt1).endAnimate();
    }
    const lc1 = tree1.leftChildId(rt1);
    const lc2 = tree2.leftChildId(rt2);
    const rc1 = tree1.rightChildId(rt1);
    const rc2 = tree2.rightChildId(rt2);
    if (lc1 && lc2) {
        await sd.pause();
        tree3.startAnimate().leftChild(rt1, lc1).endAnimate();
        await Merge(lc1, lc2);
        await sd.pause();
        f1.startAnimate().focus(rt1).endAnimate();
        f2.startAnimate().focus(rt2).endAnimate();
    } else {
        await sd.pause();
        const id = lc1 ? lc1 : lc2;
        const tree = lc1 ? tree1 : tree2;
        tree3.startAnimate().leftChild(rt1, id).color(id, C.green).endAnimate();
        Build(tree, id, C.green);
    }
    if (rc1 && rc2) {
        await sd.pause();
        tree3.startAnimate().rightChild(rt1, rc1).endAnimate();
        await Merge(rc1, rc2);
        await sd.pause();
        f1.startAnimate().focus(rt1).endAnimate();
        f2.startAnimate().focus(rt2).endAnimate();
    } else {
        await sd.pause();
        const id = rc1 ? rc1 : rc2;
        const tree = rc1 ? tree1 : tree2;
        tree3.startAnimate().rightChild(rt1, id).color(id, C.blue).endAnimate();
        Build(tree, id, C.blue);
    }
    await sd.pause();
    pushUpText.x(tree3.element(rt1).mx() + 5).cy(tree3.element(rt1).cy());
    pushUpText.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    pushUpText.startAnimate().opacity(0).endAnimate();
    if (rt1 === 1) {
        f1.startAnimate().focus(null).endAnimate();
        f2.startAnimate().focus(null).endAnimate();
    }
}

function Build(tree, rt, col) {
    const lc = tree.leftChildId(rt);
    const rc = tree.rightChildId(rt);
    tree.startAnimate().color(rt, col).endAnimate();
    if (lc) {
        tree3.startAnimate().leftChild(rt, lc).color(lc, col).endAnimate();
        Build(tree, lc, col);
    }
    if (rc) {
        tree3.startAnimate().rightChild(rt, rc).color(rc, col).endAnimate();
        Build(tree, rc, col);
    }
}