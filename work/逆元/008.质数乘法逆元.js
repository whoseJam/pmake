import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let fs = 40;

main();

async function main() {
    await sd.pause();
    let M = 7;
    let pow = ApowB(1, M - 1);
    pow[0].x(100).y(100).font_size(fs);

    for (let i = 1; i < M; i++) {
        if (i !== 1) switch_to(pow[0], i);
        let ans = 1;
        for (let j = 1; j <= M - 1; j++) ans = ans * i % M;
        let tans = sd.Text(svg, " = " + ans + ` (mod M=${M})`)
            .x(pow[0].mx() + 5).y(pow[0].y())
            .font_size(fs);
        pow[0].font_size(40)
              .x(100).y(100)
              .drag(true).resizeable(true);
        await sd.pause();
        let L = ApowB(i, M - 2);
        L[0].x(100).y(200).font_size(fs);
        let R = sd.Text(svg, " * " + i + " = " + ans + ` (mod M=${M})`).font_size(fs)
            .x(L[0].mx() + 5).y(L[0].y())
            .font_size(fs);
        L[0].opacity(0); L[1].opacity(0); R.opacity(0);
        L[0].start_animate().opacity(1).end_animate();
        L[1].start_animate().opacity(1).end_animate();
        R.start_animate().opacity(1).end_animate();
        await sd.pause();

        let inv = 1;
        for (let j = 1; j <= M - 2; j++) inv = inv * i % M;
        let final = sd.Text(svg, `${inv} * ${i} = 1 (mod M=${M})`)
            .x(100).y(300).font_size(fs);
        final.opacity(0).start_animate().opacity(1).end_animate();

        await sd.pause();

        tans.start_animate().opacity(0).end_animate().remove();
        L[0].start_animate().opacity(0).end_animate().remove();
        L[1].start_animate().opacity(0).end_animate().remove();
        R.start_animate().opacity(0).end_animate().remove();
        final.start_animate().opacity(0).end_animate().remove();
    }
    pow[0].remove();
    pow[1].remove();
}

function ApowB(a, b) {
    let A = sd.Text(svg, a);
    let B = sd.Text(svg, b);
    let ans = [A, B];
    function update() {
        B.font_size(A.font_size() * 0.5);
        B.x(A.mx()).y(A.y() - B.font_size() * 0.5);
    };
    A.listen("onX", update);
    A.listen("onY", update);
    A.listen("onWidth", update);
    A.listen("onHeight", update);
    update();
    return ans;
}

function switch_to(txt, str) {
    txt.start_animate().dy(fs).opacity(0).end_animate()
       .text(str).dy(-fs*2)
       .start_animate().dy(fs).opacity(1).end_animate();
}