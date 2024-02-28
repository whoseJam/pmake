import * as sd from "../lib/slide";

let svg = sd.svg();
let g = new sd.Grid(svg).x(100).y(100).m(5).n(6);

main();

async function main() {
    await sd.pause();
    g.insert(0, 0, 5);
    await sd.pause();
    g.insert(1, 0, "(1,0)");
    await sd.pause();
    g.pushCol();
    await sd.pause();
    g.pushRow();
    await sd.pause();
}