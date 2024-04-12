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
}