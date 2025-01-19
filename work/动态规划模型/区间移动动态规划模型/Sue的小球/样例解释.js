import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const eggs = [[1, 5], [2, 4], undefined, [4, 6], [5, 1], [6, 5], [8, 3], [10, 4]];
const circles = [];
const start = 2;
let gap = 5;

sd.init(() => {
    eggs.forEach(egg => {
        if (egg === undefined) circles.push(undefined);
        else {
            const circle = new sd.Circle(svg).center(pos(egg)).color(C.cyan);
            circle.childAs("arrow", new sd.Line(circle).arrow(), function (parent, child) {
                child.source(parent.pos("cx", "my"));
                child.target(parent.pos("cx", "my", 0, 20));
            });
            circles.push(circle);
        }
    });
    interactableIntervalMove(circles, start, { onMove });
    const x = new sd.Line(svg)
        .source(0, 50)
        .target(eggs[eggs.length - 1][0] * 50 + 50, 50)
        .arrow();
    const y = new sd.Line(svg)
        .source(0, 50)
        .target(0, -30 * 8)
        .arrow();
});

sd.main(async () => {});

async function onMove(s, t) {
    const es = circles[s];
    const et = circles[t];
    circles[t].startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg);
    if (es === undefined) line.source((circles[s - 1].cx() + circles[s + 1].cx()) / 2, 50 - gap);
    else line.source(es.cx(), 50 - gap);
    line.target(et.cx(), 50 - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}

function pos(vec) {
    return [vec[0] * 50, -30 * vec[1]];
}
