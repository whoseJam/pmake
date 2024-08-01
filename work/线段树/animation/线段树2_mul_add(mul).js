import * as sd from "@/sd";
import { createLazytagGraph } from "./线段树基础动画库";

const svg = sd.svg();
const C = sd.color();
const lazy = createLazytagGraph(svg,
    ["M", "A", "M_0"],
    ["M\\times M_0", "A\\times M_0"],
    [C.red, C.deepSkyBlue]
).cx(600).cy(300);

main();

async function main() {
    await lazy.showTagPath();
    await lazy.showNewTagPath();
    await sd.pause();
}
