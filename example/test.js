import * as sd from "#lib/slide";

let svg = sd.svg();

let c1 = sd.CurveLink(svg).source(100, 100).target(200, 100);
let c2 = sd.CurveLink(svg).source(100, 100).target(200, 100).bending(-0.5);
let p1 = sd.Circle(svg).cx(100).cy(100);
let p2 = sd.Circle(svg).cx(200).cy(100);
c1.from(p1).to(p2);
c2.from(p1).to(p2);

main();

async function main() {
    await sd.pause();
    c2.startAnimate().bending(0.5).endAnimate();
    c2.startAnimate().bending(-0.5).endAnimate();
    
    // tr.startAnimate().cut(2, 5).endAnimate();
    // tr.startAnimate().cut(2 ,4).endAnimate();
    // await sd.pause();
    // tr.startAnimate().link(3, 5).endAnimate();
    // tr.startAnimate().link(5 ,4).endAnimate();
    // await sd.pause();
    // tr.startAnimate().fromExistedElem().newNode(6, box).newLink(2, 6).endAnimate();
} 