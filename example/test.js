import * as sd from "#lib/slide";
import { Node } from "../lib/Node/Node";
import { MathjaxHelper } from "../lib/Utility/MathjaxHelper";

let svg = sd.svg();
let lk = sd.Link(svg).source(100, 100).target(200, 200).arrow();

main();

async function main() {
    let t = lk.totalLength();
    await sd.pause();
    lk.strokeDashOffset(t*2);
    lk.strokeDashArray(t);
    lk.startAnimate().strokeDashOffset(t).endAnimate();
}
