import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();

sd.main(TestLink);

async function TestChristmasTree() {
    const pen = new sd.PathPen(svg);
    const cc = Math.PI * 2;
    pen.MoveTo(V.makeComplex(15, 0))
        .LinkTo(V.makeComplex(15, cc / 2))
        .LinkTo(V.makeComplex(19, cc / 2 / 3))
        .LinkTo(V.makeComplex(11, -cc / 2 / 2))
        .LinkTo(V.makeComplex(19, (cc / 2 / 3) * 2))
        .LinkTo(V.makeComplex(15, 0));
    function makeStar() {
        return new sd.Path(svg).d(pen.toString()).color(C.yellow).fillOpacity(1);
    }
    const tree = new sd.Tree(svg).x(100).y(100).width(600);
    function build(x, l, r) {
        tree.newNode(x, " ");
        tree.color(x, C.GREEN);
        if (l === r) return;
        const mid = (l + r) >> 1;
        build(x * 2, l, mid);
        build(x * 2 + 1, mid + 1, r);
        tree.link(x, x * 2);
        tree.element(x, x * 2).color(C.orange);
        tree.link(x, x * 2 + 1);
        tree.element(x, x * 2 + 1).color(C.orange);
    }
    build(1, 1, 8);
    tree.newNode(16, " ");
    tree.newNode(17, " ");
    tree.link(11, 16);
    tree.link(12, 17);
    tree.color(16, C.RED);
    tree.color(17, C.RED);
    tree.color(11, 16, C.red);
    tree.color(12, 17, C.red);
    tree.value(1, makeStar());
    tree.value(5, makeStar());
    tree.value(13, makeStar());
}

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

async function TestLayout() {
    const tree = new sd.Tree(svg).x(100).y(100);
    tree.link(1, 2).link(2, 3).link(1, 4);
    await sd.pause();
    tree.startAnimate().layout("horizontal").endAnimate();
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

async function TestBuildTree() {
    const tree = new sd.Tree(svg);
    // tree.link(1, 2).link(1, 3);
    // tree.newNode(1);
    tree.newNode(1);
    tree.newLink(1, 2);
    await sd.pause();
    tree.newNode(2);
    console.log(tree.rootId());
}

async function TestDepth() {
    const rect = new sd.Rect(svg);
    const tree = new sd.Tree(svg);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5);
    console.assert(tree.depth() === 3);
    console.assert(tree.depth(1) === 1);
    console.assert(tree.depth(3) === 2);
    console.assert(tree.depth(5) === 3);
    // tree.depth(rect);
    try {
        tree.depth(rect);
    } catch {
        console.log("Successfully catch the error");
    }
}

async function TestAncestorId() {
    const tree = new sd.Tree(svg);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5);
    console.assert(tree.ancestorId(1, 0) === "1");
    console.assert(tree.ancestorId(1, 1) === undefined);
    console.assert(tree.ancestorId(4, 0) === "4");
    console.assert(tree.ancestorId(4, 1) === "2");
    console.assert(tree.ancestorId(4, 2) === "1");
    console.assert(tree.ancestorId(4, 4) === undefined);
    console.assert(tree.ancestorId(4, 100) === undefined);
}

async function TestFatherId() {
    const tree = new sd.Tree(svg);
    tree.link(1, 2).link(1, 3).link(2, 4).link(2, 5);
    console.assert(tree.fatherId(1) === undefined);
    console.assert(tree.fatherId(2) === "1");
    console.assert(tree.fatherId(3) === "1");
    console.assert(tree.fatherId(4) === "2");
    console.assert(tree.fatherId(5) === "2");
}

async function TestLink() {
    const tree = new sd.Tree(svg).root(1).cx(600).y(100);
    await sd.pause();
    tree.startAnimate().link(1, 2).link(1, 3).endAnimate();
    await sd.pause();
    tree.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    tree.startAnimate().width(100).endAnimate();
}
