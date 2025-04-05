import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestDepth);

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

async function TestBasic() {
    const t = new sd.Tree(svg);
    t.root(1).cx(600).y(100);
    await sd.pause();
    t.startAnimate();
    t.link(1, 2);
    t.link(1, 3);
    t.endAnimate();
    await sd.pause();
    t.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().width(100).endAnimate();
}
