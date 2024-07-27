import * as sd from "@/sd";

const svg = sd.svg();
const L = 0;
const R = 15;
const target = sd.rand(1, 7);
const arr = sd.WithBrace(new sd.Array(svg)).resize(R - L + 1);
const data = [];

sd.Label(arr, "x");
sd.Label(arr, `target = ${target}`, "bc", 20, 150);

init();
main();

function init() {
    for (let i = 1; i <= arr.length(); i++)
        data.push(sd.rand(1, 7));
    data.sort((a, b) => a - b);
    for (let i = 0; i < arr.length(); i++)
        arr.value(i, data[i]);
}

async function main() {
    await sd.pause();
    let pos = 0;
    while (data[pos] <= target) pos++; pos--;
    const b1 = arr.brace(L, pos, "t").label("data <= target");
    const b2 = arr.brace(pos + 1, R, "t").label("data > target");
    b1.opacity(0).startAnimate().opacity(1).endAnimate();
    b2.opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    const l = sd.Pointer(arr, "l", "t");
    const r = sd.Pointer(arr, "r", "t");
    const mid = sd.Pointer(arr, "mid", "b", 50);
    l.startAnimate().moveTo(L).endAnimate();
    r.startAnimate().moveTo(R).endAnimate();

    let curL = L, curR = R, curMid;
    while (curL <= curR) {
        curMid = (curL + curR) >> 1;
        await sd.pause();
        mid.startAnimate().moveTo(curMid).endAnimate();

        console.log("cur=", data[curMid], "target=", target);
        if (data[curMid] <= target) {
            await sd.pause();
            l.startAnimate().moveTo(curL = curMid + 1).endAnimate();
        } else {
            await sd.pause();
            r.startAnimate().moveTo(curR = curMid - 1).endAnimate();
        }
        await sd.pause();
        mid.startAnimate().moveTo(null).endAnimate();
    }
}