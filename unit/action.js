import * as sd from "@/sd";

let svg = sd.svg();
let R = sd.rule();
let r = new sd.Rect(svg).width(100).cx(600).cy(300);
let ir = new sd.Rect(svg);
r.childAs("newRect", ir, R.CenterOnly());

main();
console.log(r._.animateL, r._.animateR, "animate");

async function main() {
    await sd.pause();
    console.log("--------------start----------------");
    console.log(r._.animateL, r._.animateR, "animate");
    r.startAnimate()
    console.log(r._.animateL, r._.animateR, "animate");
    r.width(200).cx(600).cy(400);
    r.endAnimate()

    // r.startAnimate()
    // r.width(100).cx(600).cy(400);
    // r.endAnimate()
    await sd.pause();
}