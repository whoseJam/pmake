import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let box = sd.Box(svg).width(500).height(350).cx(600).cy(300);
    let hint = sd.Text(svg).font_size(50).x(100).my(100).text("color = white");
    box.start_animate()
       .value(sd.Rect(svg).color(C.BLUE))
       .rate(2)
       .end_animate();

    while (true) {
        await sd.pause();
        let color = C.rand();
        box.start_animate()
           .color(color)
           .end_animate();
        hint.text(`color = ${color}`)
    }
}