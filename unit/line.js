import * as sd from "@/sd";

let svg = sd.svg();

main();

async function main() {
    await sd.pause();
    let obj = new sd.Line(svg).source(100, 100).target(500, 200);
    obj.value("2");
    await sd.pause();
    obj.arrow();
    while (true) {
        await sd.pause();
        obj.startAnimate().dx(40).endAnimate();
        await sd.pause();
        console.log("P S -> T");
        obj.startAnimate().pointStoT().endAnimate();
        await sd.pause();
        console.log("F S -> T");
        obj.startAnimate().fadeStoT().endAnimate();
        await sd.pause();
        console.log("P T -> S");
        obj.startAnimate().pointTtoS().endAnimate();
        await sd.pause();
        console.log("F T -> S");
        obj.startAnimate().fadeTtoS().endAnimate();
    }
}