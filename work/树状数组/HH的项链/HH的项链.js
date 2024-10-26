import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [0, 1, 2, 3, 2, 3, 1, 2, 1, 3];
const arr = new sd.Array(svg);

init();
main();

function init() {
    arr.push();
    for (let i = 1; i < data.length; i++) {
        arr.push(data[i]);
    }
    arr.cx(600).cy(300);
}

async function main() {
    for (let i = 1; i < data.length; i++) {
        await sd.pause();
        let j = i - 1;
        for (; j >= 1; j--) {
            if (data[j] === data[i]) break;
        }
        const curve = new sd.Curve(arr).bending(1);
        link(curve, arr.element(i), arr.element(j));
        curve.value(new sd.Text(curve, "prev").fontSize(10), R.PointAtPathByRate(0.5, "cx", "my"));
        curve.startAnimate().pointStoT().endAnimate().arrow();
    }
    await sd.pause();
    arr.startAnimate().color(3, 7, C.green).endAnimate();
}

function link(link, e1, e2) {
    link.source(e1.cx(), e1.y());
    link.target(e2.cx(), e2.y());
}