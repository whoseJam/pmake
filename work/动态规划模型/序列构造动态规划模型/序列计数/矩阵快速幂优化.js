import * as sd from "@/sd";

const svg = sd.svg();
const n = 6;
const p = 4;
const arr = new sd.ValueArray(svg).elementWidth(100).start(1);

sd.init(() => {
    for (let i = 1; i <= n; i++)
        arr.push(makeVector(p, i));
})

sd.main(async () => {
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        for (let j = 0; j < p; j++) {
            for (let k = 0; k < p; k++) {
                sd.Link(arr.element(i - 1).element(j), arr.element(i).element(k), sd.Line, "mx", "cy", "x", "cy").startAnimate().pointStoT().endAnimate().arrow();
            }
        }
    }
})

function makeVector(n, i) {
    const vec = new sd.Stack(svg).resize(n);
    sd.Label(vec, `$f_{${i}}$`, "tc");
    return vec;
}