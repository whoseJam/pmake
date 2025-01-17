import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const lights = [1, 2, 4, 5, 6, 8, 10];
const circles = [];
const start = 4;
let gap = 5;

sd.init(() => {
    lights.forEach(light => {
        const circle = new sd.Circle(svg).center(pos(light)).color(C.yellow);
        circles.push(circle);
    });
    interactableIntervalMove(circles, start, { onMove });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    circles[start].startAnimate().stroke(C.red).strokeWidth(3).color(C.grey).endAnimate();
});

async function onMove(s, t) {
    const es = circles[s];
    const et = circles[t];
    circles[t].startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg).source(es.cx(), es.y() - gap).target(et.cx(), et.y() - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}

function pos(x) {
    return [x * 50, 0];
}
