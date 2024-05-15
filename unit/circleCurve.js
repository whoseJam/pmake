import * as sd from "../lib/slide";

let svg = sd.svg();
let c = new sd.CircleCurve(svg);
c.target(100, 100).source(120, 100);
let b = new sd.Brace(svg);
b.target(100, 200).source(120, 200);

main();

async function main() {
    await sd.pause();
}