import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let rct = sd.Rect(svg).width(100).height(100)
        .cx(200).cy(100).drag(true).color(C.BLUE);
    await sd.pause();
    while (true) {
        rct.start_animate().dx(800).end_animate()
           .start_animate().dy(400).end_animate()
           .start_animate().dx(-800).end_animate()
           .start_animate().dy(-400).end_animate();

        await sd.pause();
    }
}