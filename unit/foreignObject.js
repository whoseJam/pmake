import * as sd from "@/sd";

const svg = sd.svg();
const o = new sd.ForeignObject(svg);

o.html(`<div xmlns="http://www.w3.org/1999/xhtml"><p><b>你好</b>世界</p></div>`)

main();

async function main() {
    await sd.pause();
    o.startAnimate().x(100).y(100).endAnimate();
    await sd.pause();
    o.startAnimate().height(200).endAnimate();
    await sd.pause();
    o.startAnimate().width(200).endAnimate();
    await sd.pause();
}