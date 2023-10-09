import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let box = sd.Box(svg).x(100).y(200);
    let hint = sd.Text(svg, "[Next] 让box移动到中央").font_size(50).x(100).my(100);
    await sd.pause();
    box.start_animate()
       .width(500).height(350).cx(600).cy(300)
       .end_animate();
    hint.text("[Next] 让box装入不同的元素");
    await sd.pause();
    box.start_animate()
       .value(sd.Text(box, "Helle World"))
       .end_animate();
    await sd.pause();
    box.start_animate()
       .value(sd.Rect(box).color(C.RED))
       .end_animate();
    await sd.pause();
    box.start_animate()
       .value(sd.Circle(box).color(C.GREEN))
       .end_animate();
    hint.text("[Next] 让box和box-value可交互");
    await sd.pause();
    box.drag(true).resizeable(true);
    box.value().drag(true).resizeable(true);
    hint.text("[Next] 现在box和box-value可交互，单击以进行尝试");
}