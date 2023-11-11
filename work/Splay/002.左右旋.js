import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let H = 60;
let lg, alg, rg, arg;

main();

async function main() {
    leftRotate();
    rightRotate();
    await sd.pause();
    lg.startAnimate().color("Rx", C.orange).endAnimate();
    alg.startAnimate().color("Rx", C.orange).endAnimate();
}

function leftRotate() {
    let g = sd.Tree(svg).drag(true).resizeable(true);
    g.x(100).y(50).layerHeight(H);
    g.newNode("z");
    g.newNode("y");
    g.newNode("x");
    g.nodeType(sd.TriangleVertex);
    g.newNode("Lx");
    g.newNode("Rx");
    g.newNode("Ry");
    g.newLink("z", "y");
    g.newLink("y", "x");
    g.newLink("y", "Ry");
    g.newLink("x", "Lx");
    g.newLink("x", "Rx");
    lg = g;

    let afterG = sd.Tree(svg).drag(true).resizeable(true);
    afterG.x(100).y(300).layerHeight(H);
    afterG.newNode("z");
    afterG.newNode("x");
    afterG.nodeType(sd.TriangleVertex).newNode("Lx");
    afterG.nodeType(sd.Vertex).newNode("y");
    afterG.nodeType(sd.TriangleVertex);
    afterG.newNode("Rx");
    afterG.newNode("Ry");
    afterG.newLink("z", "x");
    afterG.newLink("x", "y");
    afterG.newLink("x", "Lx");
    afterG.newLink("y", "Rx");
    afterG.newLink("y", "Ry");
    alg = afterG;
}

function rightRotate() {
    let g = sd.Tree(svg).drag(true).resizeable(true);
    g.x(600).y(50).layerHeight(H);
    g.newNode("z");
    g.newNode("y");
    g.nodeType(sd.TriangleVertex).newNode("Ly");
    g.nodeType(sd.Vertex).newNode("x");
    g.nodeType(sd.TriangleVertex)
    g.newNode("Lx");
    g.newNode("Rx");
    g.newLink("z", "y");
    g.newLink("y", "Ly");
    g.newLink("y", "x");
    g.newLink("x", "Lx");
    g.newLink("x", "Rx");
    rg = g;

    let afterG = sd.Tree(svg).drag(true).resizeable(true);
    afterG.x(600).y(300).layerHeight(H);
    afterG.newNode("z");
    afterG.newNode("y");
    afterG.nodeType(sd.TriangleVertex).newNode("Ly");
    afterG.nodeType(sd.Vertex).newNode("x");
    afterG.nodeType(sd.TriangleVertex)
    afterG.newNode("Lx");
    afterG.newNode("Rx");
    afterG.newLink("z", "x");
    afterG.newLink("x", "y");
    afterG.newLink("x", "Rx");
    afterG.newLink("y", "Ly");
    afterG.newLink("y", "Lx");
    arg = afterG;
}
