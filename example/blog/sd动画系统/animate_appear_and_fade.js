import * as sd from "#lib/slide";

let svg = sd.svg();

main();

async function main() {
    let hint = sd.Text(svg)
        .font_size(50)
        .x(100).y(100)
        .drag(true);
    
    hint.text("[Next] 点击使Hello World消失");
    let txt = sd.Text(svg, "Hello World").font_size(100)
        .cx(600).cy(300).drag(true);
    await sd.pause();
    while (true) {
        txt.start_animate().dx(40).opacity(0).end_animate()
        hint.after(txt).text("[Next] 点击使Hello World出现");
        await sd.pause();

        
        txt.dx(-80)
           .start_animate().dx(40).opacity(1).end_animate();
        hint.after(txt).text("[Next] 点击使Hello World消失");
        await sd.pause();
    }
}