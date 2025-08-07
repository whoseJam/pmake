import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const maxValue = 6;
const data = [2, 1, 4, 3, 2, 5, 6, 4];
const arr = new sd.Array(svg).x(100).y(200).start(1);
let firstBucket;

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i", "t").startAnimate().moveTo(data.length).endAnimate();
    await sd.pause();
    const pj = sd.Pointer(arr, "j", "t");
    for (let i = 1; i < arr.length(); i++) {
        arr.startAnimate();
        pj.moveTo(i);
        arr.color(i, arr.intValue(i) < arr.intValue(arr.end()) ? C.green : C.red);
        arr.endAnimate();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, data.length, {
        onCreateFirstBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Pile(svg).elementWidth(15).elementHeight(15).resize(maxValue).start(1);
    stk.cx(cx).my(arr.y() - 5);
    for (let i = 1; i <= maxValue; i++) {
        sd.Label(stk.element(i), i, "lc", 10, 3);
    }
    stk.opacity(0).startAnimate().opacity(1).endAnimate();
    firstBucket = stk;
}

async function onUpdateBucket(arr, j) {
    await sd.pause();
    const current = arr.element(j);
    const v = arr.intValue(j);
    const pen = new sd.PathPen(svg).MoveTo(current.pos("cx", "y")).LinkTo(current.cx(), firstBucket.element(v).cy()).LinkTo(firstBucket.element(v).pos("mx", "cy"));
    const link = new sd.Path(svg).d(pen.toString());
    link.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    link.startAnimate().opacity(0.2).endAnimate();
}

async function onUpdateCurrent(arr, i) {
    await sd.pause();
    const current = arr.element(i);
    const v = arr.intValue(i);
    const links = [];
    firstBucket.startAnimate();
    for (let i = 1; i < v; i++) {
        firstBucket.color(i, C.blue);
        const pen = new sd.PathPen(svg).MoveTo(firstBucket.element(i).pos("mx", "cy")).LinkTo(current.cx(), firstBucket.element(i).cy()).LinkTo(current.pos("cx", "y"));
        const link = new sd.Path(svg).d(pen.toString());
        link.startAnimate().pointStoT().endAnimate().arrow();
        links.push(link);
    }
    firstBucket.endAnimate();
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}
