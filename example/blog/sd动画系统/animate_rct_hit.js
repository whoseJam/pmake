import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let L = 100, G = 300, S = 100;
    let b1 = sd.Rect(svg).color(C.RED).x(S).y(300).width(L).height(L);
    let b2 = sd.Rect(svg).color(C.GREEN).x(S + G).y(300).width(L).height(L);
    let b3 = sd.Rect(svg).color(C.BLUE).x(S + G + G).y(300).width(L).height(L);
    await sd.pause();

    while (true) {
        b1.start_animate().dx(G - L).end_animate();
        b2.after(b1).start_animate().dx(G - L).end_animate();
        b3.after(b2).start_animate().dx(G - L).end_animate();
        await sd.pause();

        b3.start_animate().dx(L - G).end_animate();
        b2.after(b3).start_animate().dx(L - G).end_animate();
        b1.after(b2).start_animate().dx(L - G).end_animate();
        await sd.pause();
    }
}