import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const logV = 3;
const data = [1, 6, 2, 7, 4];
const arr = new sd.Array(svg);

sd.init(() => {
    for (let i = 0; i < data.length; i++)
        arr.push(binaryStr(data[i]));
})

sd.main(async () => {
    await sd.pause();
    const pi = sd.Pointer(arr, "i", "b", 3, 20, 3).startAnimate().moveTo(data.length - 1).endAnimate();
    await sd.pause();
    const pj = sd.Pointer(arr, "j", "b", 3, 20, 3);
    for (let i = 0; i < data.length - 1; i++) {
        arr.startAnimate();
        pj.moveTo(i);
        arr.color(i, (data[i] & data[data.length - 1]) === 0 ? C.red : C.green);
        arr.endAnimate();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    pi.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, data.length - 1, {
        onCreateFirstBucket,
        onCreateBucket,
        onUpdateBucket,
        onUpdateCurrent
    });
})

async function onUpdateBucket(arr, j) {
    const firstBucket = global.firstBucket;
    const currentBucket = arr.element(j).child("stk");
    const links = [];
    await sd.pause();
    for (let i = 0; i < logV; i++) {
        if (currentBucket.text(i) === "1") {
            const link = sd.Link(currentBucket.element(i), firstBucket.element(i)).startAnimate().pointStoT().endAnimate().arrow();
            links.push(link);
        }
    }
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}

async function onUpdateCurrent(arr, i) {
    const firstBucket = global.firstBucket;
    const currentBucket = arr.element(i).child("stk");
    const links = [];
    await sd.pause();
    for (let i = 0; i < logV; i++) {
        if (currentBucket.text(i) === "1") {
            const link = sd.Link(firstBucket.element(i), currentBucket.element(i)).startAnimate().pointStoT().endAnimate().arrow();
            links.push(link);
        }
    }
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Stack(svg).elementWidth(15).elementHeight(15).resize(logV);
    stk.cx(cx).my(arr.y() - 5).opacity(0).startAnimate().opacity(1).endAnimate();
    global.firstBucket = stk;
}

async function onCreateBucket(arr, i) {
    const element = arr.element(i);
    const stk = new sd.Stack(svg).elementWidth(15).elementHeight(15).resize(logV);
    for (let i = 0; i < logV; i++) stk.value(i, element.text()[i]);
    element.startAnimate().childAs("stk", stk.onEnter(EN.appear()), R.aside("tc", 5)).endAnimate();
}

function binaryStr(x) {
    let ans = "";
    for (let i = 0; i < logV; i++) {
        ans = String(x % 2) + ans;
        x = Math.floor(x / 2);
    }
    return ans;
}