import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
// const str = " abbabaabbabb";
const str = " axabaaxayaxabaaxax";
const n = str.length - 1;
const arr = new sd.Array(svg).x(100).y(200).resize(str.length);
const nxt = sd.make1d(100, 0);
const rangeF = sd.Brace(arr);
const rangeB = sd.Brace(arr);
const rangeBF = sd.Brace(arr);
const rangeBB = sd.Brace(arr);
const pntCur = sd.Pointer(arr, "cur");
const pntI = sd.Pointer(arr, "i");

sd.init(() => {
    for (let i = 0; i <= n; i++) {
        arr.value(i, str[i]);
    }
})

sd.main(async () => {
    let cur = 0;
    pntCur.moveTo(0);
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        pntI.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        arr.startAnimate().color(i, C.orange).endAnimate();
        while (true) {
            await sd.pause();
            arr.startAnimate().color(cur + 1, C.blue).endAnimate();
            if (str[cur + 1] === str[i]) {
                await sd.pause();
                arr.startAnimate();
                arr.color(cur + 1, C.green);
                arr.color(i, C.green);
                arr.endAnimate();
                await sd.pause();
                pntCur.startAnimate().moveTo(nxt[i] = ++cur).endAnimate();
                updateBFAndBB(i, cur);
                await sd.pause();
                arr.startAnimate().color(C.white).endAnimate();
                break;
            } else if (nxt[cur] >= 1){ 
                await sd.pause();
                arr.startAnimate().color(cur + 1, C.grey).endAnimate();
                await sd.pause();
                rangeF.brace(1, nxt[cur]).startAnimate().opacity(1).endAnimate();
                rangeB.brace(cur - nxt[cur] + 1, cur).startAnimate().opacity(1).endAnimate();
                await sd.pause();
                pntCur.startAnimate().moveTo(cur = nxt[cur]).endAnimate();
                updateBFAndBB(i - 1, cur);
                await sd.pause();
                rangeF.startAnimate().opacity(0).endAnimate();
                rangeB.startAnimate().opacity(0).endAnimate();
                if (cur === 0 && str[cur + 1] !== str[i]) {
                    await sd.pause();
                    arr.startAnimate().color(C.white).endAnimate();
                    break;
                }
            } else {
                await sd.pause();
                arr.startAnimate().color(cur + 1, C.grey).endAnimate();
                if (cur === 0 && str[cur + 1] !== str[i]) {
                    await sd.pause();
                    arr.startAnimate().color(C.white).endAnimate();
                    break;
                }
                await sd.pause();
                pntCur.startAnimate().moveTo(cur = nxt[cur]).endAnimate();
                updateBFAndBB(i - 1, cur);
            }
        }
    }
})

function updateBFAndBB(i, cur) {
    if (rangeBF.opacity() > 0) {
        if (cur > 0) {
            rangeBF.startAnimate().brace(1, cur).endAnimate();
            rangeBB.startAnimate().brace(i - cur + 1, i).endAnimate();
        } else {
            rangeBF.startAnimate().opacity(0).endAnimate();
            rangeBB.startAnimate().opacity(0).endAnimate();
        }
    } else {
        rangeBF.startAnimate().brace(1, cur).endAnimate();
        rangeBB.startAnimate().brace(i - cur + 1, i).opacity(1).endAnimate();
    }
}