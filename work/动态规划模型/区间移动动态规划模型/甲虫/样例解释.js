import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const waters = [1, 2, undefined, 4, 5, 6, 8, 10];
const circles = [];
const start = 2;
let gap = 5;

sd.init(() => {
    waters.forEach(water => {
        if (water === undefined) circles.push(undefined);
        else {
            const circle = new sd.Circle(svg).center(pos(water)).color(C.textBlue);
            circles.push(circle);
        }
    });
    interactableIntervalMove(circles, start, { onMove });
});

sd.main(async () => {});

async function onMove(s, t) {
    const es = circles[s];
    const et = circles[t];
    circles[t].startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg);
    if (es === undefined) line.source((circles[s - 1].cx() + circles[s + 1].cx()) / 2, circles[s - 1].y() - gap);
    else line.source(es.cx(), es.y() - gap);
    line.target(et.cx(), et.y() - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}

function pos(x) {
    return [x * 50, 0];
}
