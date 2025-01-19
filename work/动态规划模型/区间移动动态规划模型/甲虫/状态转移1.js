import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const waters = [1, 2, 4, 5, 6, 8, 10];
const l = 2;
const r = 5;
const circles = [];
let gap = 5;
let triggered = false;

D.onKeyDown("a", () => {
    if (triggered) return;
    triggered = true;
    sd.inter(async () => {
        await onMove(l, l - 1);
    });
});

D.onKeyDown("d", () => {
    if (triggered) return;
    triggered = true;
    sd.inter(async () => {
        await onMove(l, r + 1);
    });
});

sd.init(() => {
    waters.forEach((water, id) => {
        const circle = new sd.Circle(svg).center(pos(water)).color(l <= id && id <= r ? C.grey : C.textBlue);
        circles.push(circle);
    });
    sd.Brace(svg).brace(circles[l], circles[r], "t").value("已喝");
    sd.Pointer(svg, "l", "t", 3, 20).moveTo(circles[l]);
    sd.Pointer(svg, "r", "t", 3, 20).moveTo(circles[r]);
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    circles[l].startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
});

async function onMove(s, t) {
    const es = circles[s];
    const et = circles[t];
    circles[t].startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg).source(es.cx(), es.my() + gap).target(et.cx(), et.my() + gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}

function pos(x) {
    return [x * 50, 0];
}
