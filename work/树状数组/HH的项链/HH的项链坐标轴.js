import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const x = 100;
const y = 100;
const width = 400;
const height = 200;
const arrowP = new sd.Line(svg);
const arrowI = new sd.Line(svg);

init();
main();

function init() {
    arrowP.source(x, y + height).target(x + width, y + height).arrow();
    arrowI.source(x, y + height).target(x, y).arrow();
    sd.Label(arrowP, "prev轴", "br");
    sd.Label(arrowI, "i轴", "lt");
}

async function main() {
    await sd.pause();
}