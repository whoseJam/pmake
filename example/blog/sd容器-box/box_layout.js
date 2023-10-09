import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let box = sd.Box(svg).width(500).height(350).cx(600).cy(300);
    let hint = sd.Text(svg, "layout = center").font_size(50).x(100).my(100);
    box.start_animate()
       .value(sd.Text(box, "Hello World"))
       .end_animate();

    let layouts = [
        "top_left", "top", "top_right",
        "left", "center", "right",
        "bottom_left", "bottom", "bottom_right"
    ];
    let cur = 0;
    while (true) {
        hint.text(`layout = ${layouts[cur]}`);
        await sd.pause();

        box.start_animate()
           .layout(layouts[cur])
           .end_animate();
        cur += 1;
        if (cur === layouts.length) cur = 0;
    }
}