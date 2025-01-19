import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const lights = [1, 2, 4, 5, 6, 8, 10];
const l = 3;
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
        await onMove(r, r + 1);
    });
});

sd.init(() => {
    lights.forEach((light, id) => {
        const circle = new sd.Circle(svg).center(pos(light)).color(l <= id && id <= r ? C.grey : C.yellow);
        circles.push(circle);
    });
    sd.Brace(svg).brace(circles[l], circles[r], "t").value("已关闭");
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
