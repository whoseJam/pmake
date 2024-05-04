import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = new sd.Grid(svg).x(100).y(100).m(5).n(6);

main();

async function main() {
    console.log(g.height(), "height of g");
    await sd.pause();
    g.insert(0, 0, 5);
    await sd.pause();
    g.insert(1, 0, "(1,0)");
    await sd.pause();
    g.pushCol();
    await sd.pause();
    g.pushRow();
    await sd.pause();
    sd.Index(g, "l");
    await sd.pause();
    sd.Index(g, "t");
    await sd.pause();
    sd.Index(g, "r");
    await sd.pause();
    sd.Index(g, "b");
    await sd.pause();
}