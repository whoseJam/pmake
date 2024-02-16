import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let t = new sd.HorizontalValueTree(svg).x(100).y(100).layerWidth(100);
    function makeVertex(i) {
        return new sd.Vertex(svg).rate(1.6).value(new sd.Mathjax(svg, `C_{${i}}`));
    }
    t.root(1, makeVertex(1));
    for (let i = 2; i <= 10; i++) {
        t.newNode(i, makeVertex(i));
        t.newLink(i-1, i, new sd.Code(svg).code(`lim=${sd.rand(2, 5)}\nid=${i-1}`).fontSize(15));
    }
}