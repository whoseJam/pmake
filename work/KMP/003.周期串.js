import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let ilen = 50, tot = 18, l = 15;
let rct = sd.Rect(svg).x(100).y(100).width(ilen * tot).height(60);
let mask = sd.Rect(svg).width(ilen * (tot - l)).drag(true).color(C.ORANGE);

main();

async function main() {
    await sd.pause();
    let r1 = sd.Rect(rct).x(103).y(105).width(ilen * l).height(22.5).color(C.red);
    let r2 = sd.Rect(rct).x(97 + (tot-l)*ilen).y(132.5).width(ilen * l).height(22.5).color(C.red);
    await sd.pause();
    let r3 = sd.Rect(rct).x(r2.x()).width(r1.mx() - r2.x()).y(r1.y()).height(r1.height()).opacity(0);
    r3.color(C.BLUE).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    r3.startAnimate().y(r2.y()).endAnimate();
    await sd.pause();
    let r4 = sd.Rect(rct).x(r3.x()).width(r3.width()).y(r3.y()).height(r3.height());
    r4.color(C.BLUE).startAnimate().x(r1.x()).y(r1.y()).endAnimate();
    await sd.pause();
    let r5 = sd.Rect(rct).x(r3.x()).width(r3.width()).y(r3.y()).height(r3.height());
    r5.color(C.BLUE).startAnimate().mx(r2.mx()).y(r3.y() + 30).endAnimate();
}