import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let line = sd.Line(svg).x1(100).y1(100).x2(300).y2(300).strokeWidth(4);
    line.markerEnd("arrow");
}

