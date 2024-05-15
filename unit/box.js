import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let box = new sd.Box(svg).cx(600).cy(300);

main();

async function main() {
    await sd.pause();
    let txt = "helloworld", str = [];
    for (let i = 0; i < txt.length; i++) {
        str.push(new sd.Text(svg, txt[i]).x(Math.random() * 1200).y(Math.random() * 600));
    }
    await sd.pause();
    for (let i = 0; i < str.length; i++) {
        let t = str[i];
        box.startAnimate().valueFromExist(t).endAnimate();
    }
    await sd.pause();

    const b1 = new sd.Box(svg, "V").x(100).y(100);
    const b2 = new sd.Box(svg).x(200).y(100);
    await sd.pause();
    const e1 = b1.drop();
    b2.startAnimate().value(e1).endAnimate();
    await sd.pause();

    const b3 = new sd.Box(svg, "V").x(100).y(180);
    const b4 = new sd.Box(svg).x(200).y(180);
    await sd.pause();
    const e3 = b3.drop();
    // b3.startAnimate().value(null).endAnimate();
    b4.value(e3).endAnimate();
    await sd.pause();

    const b5 = new sd.Box(svg, "V").x(100).y(260);
    const b6 = new sd.Box(svg).x(200).y(260);
    await sd.pause();
    const e5 = b5.drop();
    b6.startAnimate().valueFromExist(e5).endAnimate();
    await sd.pause();

    const b7 = new sd.Box(svg, "V").x(100).y(340);
    const b8 = new sd.Box(svg).x(200).y(340);
    await sd.pause();
    const e7 = b7.drop();
    b8.after(b7).startAnimate().valueFromExist(e7).endAnimate();
    await sd.pause();
}