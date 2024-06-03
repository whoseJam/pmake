import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const focus = sd.Focus(tree);

init();
main();

function init() {
    tree.root("f");
    tree.link("f", "u");
    tree.link("u", "S");
    tree.link("u", "a");
    tree.link("u", "b");
    for (let v of ["S", "a", "b"]) {
        const nodeV = tree.element(v);

        const rct = new sd.Rect(nodeV.layer("underBackground"));
        if (v === "S") rct.height(140).width(80);
        else rct.height(80).width(50);
        nodeV.childAs("rect", rct, (parent, child) => {
            child.cx(parent.cx());
            child.y(parent.cy());
        })
    }
    tree.cx(600).cy(300);
}

async function main() {
    await sd.pause();
    focus.startAnimate().focus("u").endAnimate();
    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.green);
    tree.endAnimate()

    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.white);
    tree.endAnimate()

    await sd.pause();
    tree.startAnimate();
    colorNode("b", C.green);
    tree.endAnimate()

    await sd.pause();
    tree.startAnimate();
    colorNode("b", C.white);
    tree.endAnimate()

    await sd.pause();
    tree.startAnimate();
    colorNode("S", C.green);
    tree.endAnimate()

    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.green);
    colorNode("b", C.green);
    tree.endAnimate()
    
    await sd.pause();
    tree.startAnimate().color("u", C.green).endAnimate();
    await sd.pause();
}

function colorNode(u, col) {
    const nodeU = tree.element(u);
    const r = nodeU.child("rect");
    nodeU.color(col);
    if (r) r.color(col);
}