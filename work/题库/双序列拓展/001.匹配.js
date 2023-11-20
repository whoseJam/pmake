import * as sd from "#lib/slide";

let svg = sd.svg();
let a = sd.Array(svg).x(100).y(100).start(1);
let b = sd.Array(svg).x(100).y(300).start(1);
a.resize(10); b.resize(10);

main();

async function main() {
    let l = sd.Line(svg).strokeWidth(2);
    track(l, 1, 1, false);
    await sd.pause();
    track(l, 1, 2);
    await sd.pause();
    track(l, 1, 3);
    await sd.pause();
    track(l, 2, 3);
    await sd.pause();
    track(l, 2, 4);
    await sd.pause();
    track(l, 3, 4);
    await sd.pause();
    track(l, 4, 4);
    await sd.pause();
    track(l, 5, 4);

    let nowx = 5, nowy = 4;
    while(nowx < 10 || nowy < 10) {
        if (nowx < 10 && nowy < 10) {
            let d = sd.rand(0, 100);
            if (d <= 50) nowx++;
            else nowy++;
        } else if (nowx < 10) nowx++;
        else nowy++;
        await sd.pause();
        track(l, nowx, nowy);
    }
}

function track(l, i, j, animate = true) {
    let aelem = a.element(i);
    let belem = b.element(j);
    if (animate) l.startAnimate();
    l.source(aelem.cx(), aelem.cy());
    l.target(belem.cx(), belem.cy());
    if (animate) l.endAnimate();
    else l.opacity(0).startAnimate().opacity(1).endAnimate();
}