import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(40).y(40);
const sum = new sd.Array(svg).x(40).y(100);
const lpos = new sd.Array(svg).x(40).y(160);
const rpos = new sd.Array(svg).x(40).y(220);
const data = [-1, -1, -1, -1, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 6, 6, 6];
const M = 6;

sd.Label(arr, "原始序列", "lc");
sd.Label(sum, "sum", "lc");
sd.Label(lpos, "l", "lc");
sd.Label(rpos, "r", "lc");
sd.WithBrace(arr);

init();
main();

function init() {
    data.forEach(d => arr.push(d));
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1] === data[l]) {
            r++;
        }
        for (let i = l; i <= r; i++) {
            lpos.push(l + 1);
            rpos.push(r + 1);
            sum.push(r - l + 1);
        }
    }
    lpos.opacity(0);
    rpos.opacity(0);
    sum.opacity(0);
}

async function main() {
    const brace = arr.brace(1, 1, "t").opacity(0).label("查询");
    await sd.pause();
    brace.brace(4, 13).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    sum.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    brace.startAnimate().opacity(0).endAnimate();
    await sd.pause();
    brace.startAnimate().brace(10, 16).endAnimate();
    await sd.pause();
    lpos.startAnimate().opacity(1).endAnimate();
    rpos.startAnimate().opacity(1).endAnimate();
    await sd.pause();
}