import * as sd from "@/sd";

let svg = sd.svg();
let obj = new sd.Brace(svg).source(100, 100).target(200, 100);

main();

async function main() {
    await sd.pause();
    obj.startAnimate().target(300, 100).endAnimate();
    await sd.pause();
    obj.startAnimate().source(300, 200).endAnimate();
}

