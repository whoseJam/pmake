import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const charset = "cba";
const str = "accbabbaac";
const banned = ["cb", "ab", "ac"];
const arr = new sd.Array(svg).x(100).y(200).start(1);

sd.init(() => {
    arr.pushArray(str);
});

sd.main(async () => {
    await sd.pause();
    await bucketOptimize(arr, str.length, {
        onCreateFirstBucket,
        onCreateBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Stack(svg).elementWidth(15).elementHeight(15).resize(charset.length);
    stk.cx(cx).my(arr.y() - 5);
    for (let i = 0; i < charset.length; i++) {
        const lb = sd.Label(stk.element(i), charset[i], "lc", 10, 3);
    }
    stk.opacity(0).startAnimate().opacity(1).endAnimate();
    global.firstBucket = stk;
}

async function onCreateBucket(arr, i) {
    const element = arr.element(i);
    const dist = (arr.text(i).charCodeAt(0) - "a".charCodeAt(0)) * 15 + 6.3;
    element.label = sd.Label(element, arr.text(i), "tc", 10, dist).opacity(0).startAnimate().opacity(1).endAnimate();
}

async function onUpdateBucket(arr, j) {
    await sd.pause();
    const firstBucket = global.firstBucket;
    const current = arr.element(j).label;
    const link = sd.Link(current, firstBucket.element(charIndex(arr.text(j))));
    link.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    link.startAnimate().fadeStoT().endAnimate().remove();
}

async function onUpdateCurrent(arr, i) {
    await sd.pause();
    const firstBucket = global.firstBucket;
    const current = arr.element(i).label;
    const links = [];
    for (let i = 0; i < charset.length; i++) {
        const link = sd.Link(firstBucket.element(i), current);
        link.startAnimate().pointStoT().endAnimate().arrow();
        links.push(link);
    }
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}

function charIndex(a) {
    if (a === "a") return 2;
    if (a === "b") return 1;
    return 0;
}
