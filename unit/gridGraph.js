import * as sd from "../lib/slide";

let svg = sd.svg();
let g = new sd.GridGraph(svg);

g.at(2, 1).newNode(1);

main();

async function main() {
}