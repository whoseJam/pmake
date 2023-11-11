import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = sd.Tree(svg);
let arr = sd.Array(svg);
g.cx(200).y(100).layerHeight(80);
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
arr.x(100).y(400);

let afterG = sd.Tree(svg);
let afterArr = sd.Array(svg);
afterG.cx(800).cy(100).layerHeight(80);
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
afterG.opacity(0);
afterArr.x(700).y(400);

let seq = ["Lx", "x", "Rx", "y", "Ry"]

main();

async function main() {
    await sd.pause();
    afterG.startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < seq.length; i++) {
        await sd.pause();
        g.startAnimate().color(seq[i], C.green).endAnimate();
        await sd.pause();
        arr.startAnimate();
        console.log("length=", seq[i].length);
        if (seq[i].length === 2) {
            arr.push(seq[i]);
            arr.push("...");
        } else arr.push(seq[i]);
        arr.endAnimate();
        await sd.pause();
        g.startAnimate().color(seq[i], C.white).endAnimate();
    }
    for (let i = 0; i < seq.length; i++) {
        await sd.pause();
        afterG.startAnimate().color(seq[i], C.green).endAnimate();
        await sd.pause();
        afterArr.startAnimate();
        if (seq[i].length === 2) {
            afterArr.push(seq[i]);
            afterArr.push("...");
        } else afterArr.push(seq[i])
        afterArr.endAnimate();
        await sd.pause();
        afterG.startAnimate().color(seq[i], C.white).endAnimate();
    }

}