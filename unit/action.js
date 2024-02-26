import * as sd from "../lib/slide";

let svg = sd.svg();
let r = new sd.Rect(svg).x(100).y(100);

main();

async function main() {
    global.move = async function() {
        await sd.pause();
        r.startAnimate().dx(50).endAnimate();
        await sd.pause();
        r.startAnimate().dx(50).endAnimate();
        await sd.pause();
        r.startAnimate().dx(50).endAnimate();
    }
}