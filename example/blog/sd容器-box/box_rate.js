import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let box = sd.Box(svg).width(500).height(350).cx(600).cy(300);
    let hint = sd.Text(svg).font_size(50).x(100).my(100);
    box.start_animate()
       .value(sd.Text(box, "Helle World"))
       .end_animate();

    let cur = 1;
    while (true) {
        hint.text(`[Next] 让box的rate变为${cur}`);
        await sd.pause();

        box.start_animate()
           .rate(cur)
           .end_animate();
        cur += 1;
        if (cur > 5) cur = 1;
    }
}