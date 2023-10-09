import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let fs = 50;

main();

async function main() {
    let hint = sd.Text(svg)
        .font_size(fs)
        .x(200).y(500)
        .drag(true);
    let animate = sd.Text(svg)
        .text("动画化")
        .font_size(fs)
        .x(100).y(100);
    let without = sd.Text(svg)
        .text("非动画化")
        .font_size(fs)
        .x(600).y(100);
    let rct = sd.Rect(svg).x(animate.x()).y(200);
    let rcta = sd.Rect(svg).x(without.x()).y(200);
    
    hint.text("[Next] 点击调用rect.width(400)");
    await sd.pause();
    rct.start_animate()
       .width(400)
       .end_animate();
    rcta.width(400);

    hint.text("[Next] 点击调用rect.height(300)");
    await sd.pause();
    rct.start_animate()
       .height(300)
       .end_animate();
    rcta.height(300);

    hint.text("[Next] 点击调用rect.color(C.RED)");
    await sd.pause();
    rct.start_animate()
       .color(C.RED)
       .end_animate();
    rcta.color(C.RED);

    hint.text("[End]");
}