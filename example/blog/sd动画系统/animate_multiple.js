import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let fs = 50;

main();

async function main() {
    let hint = sd.Text(svg)
        .font_size(fs)
        .x(50).y(520)
        .drag(true);
    let rct = sd.Rect(svg).x(10).y(10);
    
    hint.text("[Next] 点击调用rect的一堆方法");
    await sd.pause();
    rct.start_animate()
       .x(100).y(100).width(400).height(400)
       .color(C.GREEN)
       .end_animate();

    hint.text("[End]");
}