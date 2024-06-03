import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).x(100).y(100).elementWidth(60);
const board = new sd.Text(svg).fontSize(25).x(130).y(180).opacity(0);
const left = 2;
const right = 5;
const data = [5, 1, 2, 6, 3];

init();
main();

function init() {
    data.forEach((item, idx) => {
        arr.push(item);
        const e = arr.lastElement();
        const math = new sd.Mathjax(e, `insert(${item})`).opacity(0);
        e.childAs("math", math, R.Aside((idx % 2 === 0) ? "tc" : "bc"));
    })
}

async function main() {
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        const math = arr.element(i).child("math");
        math.startAnimate().opacity(1).endAnimate();
    }
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        arr.startAnimate().color(0, i, C.green).endAnimate();
        const ok = data.slice(0, i + 1).filter(x => left <= x && x <= right).length;
        await sd.pause();
        board.text(`满足${left}<=x<=${right}的x有${ok}个`).cx(arr.cx());
        board.startAnimate().opacity(1).endAnimate();
        await sd.pause();
        arr.startAnimate().color(0, i, C.white).endAnimate();
        board.startAnimate().opacity(0).endAnimate();
    }
    await sd.pause();
}

function setText(elem, text) {
    elem.startAnimate(150).opacity(0).endAnimate();
    elem.text(text);
    elem.startAnimate(150).opacity(1).endAnimate();
}