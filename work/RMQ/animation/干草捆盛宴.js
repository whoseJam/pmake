import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(40).y(40);
const data = [2, 3, 2, 1, 4, 2, 4, 3, 1];
const M = 6;

init();
main();

function init() {
    data.forEach(d => arr.push(d));
}

async function main() {
    const focus = sd.Focus(arr);
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        focus.startAnimate().focus(i).endAnimate();
        let sum = 0, ni;
        for (let j = i; j < data.length; j++) {
            sum += data[j];
            if (sum >= M) {
                ni = j;
                break;
            }
        }
        if (sum < M) continue;
        await sd.pause();
        arr.startAnimate().color(i, ni, C.green).endAnimate();
        await sd.pause();
        arr.startAnimate().color(C.white).endAnimate();
    }
}