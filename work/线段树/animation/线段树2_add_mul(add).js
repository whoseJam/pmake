import * as sd from "@/sd";
import { createLazytagGraph } from "./线段树基础动画库";

const svg = sd.svg();
const C = sd.color();
const lazy = createLazytagGraph(svg,
    ["A", "M", "A_0"],
    ["A+\\frac{A_0}{M}", "M"],
    [C.red, C.deepSkyBlue]
).cx(600).cy(300);

main();

async function main() {
    await lazy.showTagPath();
    await lazy.showNewTagPath();
    await sd.pause();
}
