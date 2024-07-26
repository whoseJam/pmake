import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(40).y(40);
const spy = new sd.Array(svg).x(40).y(100);
const tstdata = [2, 3, 2, 1, 4, 2, 4, 3, 1];
const spyData = [4, 1, 2, 3, 6, 4, 7, 8, 5];
const M = 6;

sd.Label(arr, `最低香度=${M}`, "tc");
sd.Label(arr, "香度", "lc");
sd.Label(spy, "辣度", "lc");
sd.WithBrace(spy);

init();
main();

function init() {
    tstdata.forEach(d => arr.push(d));
    spyData.forEach(d => spy.push(d));
}

async function main() {
    const brace = spy.brace(1, 1).opacity(0).label("查询最低辣度");
    const focus = sd.Focus(arr);
    for (let i = 0; i < tstdata.length; i++) {
        await sd.pause();
        focus.startAnimate().focus(i).endAnimate();
        let sum = 0, ni;
        for (let j = i; j < tstdata.length; j++) {
            sum += tstdata[j];
            if (sum >= M) {
                ni = j;
                break;
            }
        }
        if (sum < M) continue;
        await sd.pause();
        arr.startAnimate().color(i, ni, C.green).endAnimate();
        await sd.pause();
        brace.brace(i, ni).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        arr.startAnimate()
        arr.color(C.white);
        brace.opacity(0);
        arr.endAnimate();
    }
}