import * as sd from "@/sd";

const svg = sd.svg();
const L = 0;
const R = 15;
const target = sd.rand(L + 1, R - 1);
const arr = sd.WithBrace(new sd.Array(svg)).resize(R - L + 1);

sd.Label(arr, "x");
arr.brace(L, target, "t", 10).label("合法的x");
arr.brace(target + 1, R, "t", 10).label("不合法的x");

init();
main();

function init() {

}

async function main() {
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

        if (curMid <= target) {
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