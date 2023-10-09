import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let fs = 40;

main();

async function main() {
    await sd.pause();
    let M = 7;
    let pow = ApowB(0, M - 1);
    pow[0].x(100).y(100).font_size(fs);

    for (let i = 1; i < M; i++) {
        switch_to(pow[0], i);
        let ans = 1;
        for (let j = 1; j <= M - 1; j++) ans = ans * i % M;
        let tans = sd.Text(svg, " = " + ans + ` (mod M=${M})`)
            .x(pow[0].mx() + 5).y(pow[0].y())
            .font_size(fs);
        pow[0].font_size(40)
              .x(100).y(100)
              .drag(true).resizeable(true);
        await sd.pause();
        tans.remove();
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