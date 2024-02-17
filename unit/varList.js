import * as sd from "../lib/slide";

let svg = sd.svg();
let obj = new sd.VarList(svg).x(100).y(100);

main();

async function main() {
    await sd.pause();
    obj.startAnimate().put("a", 1).endAnimate();
    obj.startAnimate().put("b", 1).endAnimate();
    await sd.pause();
    obj.startAnimate().put("a", 2).endAnimate();
    await sd.pause();
}