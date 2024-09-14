import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const data = I.readIntMatrix(`
5 9 1 2
6 9 1 3
8 13 1 7
9 14 1 1
20 25 1 3
22 28 1 5`, 6, 4, false);
const mark = sd.make1d(30);
const colorList = [C.grey, C.green, C.coral, C.blue];
const segments = [];

function Max(arr, l, r) {
    let ans = 0;
    for (let i = l; i <= r; i++)
        ans = Math.max(ans, arr[i]);
    return ans;
}

function find(l, r) {
    const mx = Max(mark, l, r);
    for (let j = l; j <= r; j++) mark[j] = mx + 1;
    return mx;
}

function canSelect(i) {
    for (let j = 0; j < data.length; j++) {
        if (j === i) continue;
        if (!data[j][4]) continue; // not selected
        if (data[i][2] === data[j][2]) continue;
        if (data[i][1] < data[j][0] || data[j][1] < data[i][0]) continue;
        return false;
    }
    return true;
}

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        const l = data[i][0];
        const r = data[i][1];
        const mx = find(l, r);
        const c = data[i][2];
        const w = data[i][3];
        data[i].push(0);
        const box = new sd.Box(svg).x(l * 40).y(mx * 60).width((r - l + 1) * 40).value(`+${w}`).color(colorList[c]);
        segments.push(box);
        box.onClick(() => {
            if (!data[i][4] && !canSelect(i)) return;
            data[i][4] ^= 1;
            if (data[i][4]) {
                box.strokeWidth(3).stroke(C.red);
            } else {
                box.strokeWidth(1).stroke(C.black);
            }
        })
    }
})

sd.main(async () => {
    await sd.pause();
    segments.forEach((segment, idx) => {
        sd.Label(segment, idx + 1, "lc", 25).opacity(0).startAnimate().opacity(1).endAnimate();
    })
})