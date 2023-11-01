import * as sd from "#lib/slide";

let svg = sd.svg();
// let c = sd.Curve(svg).drag(true);
// c.x1(100).y1(100).x2(300).y2(200);
let c2 = sd.Bezier(svg).drag(true).resizeable(true);
c2.x1(500).y1(200).x2(800).y2(400).strokeWidth(5);

async function main() {

}