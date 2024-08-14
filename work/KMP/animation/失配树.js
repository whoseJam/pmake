import * as sd from "@/sd";

const svg = sd.svg();
const str = " abbabaabbabb";
const n = str.length - 1;
const arr = new sd.Array(svg);
const nxt = sd.make1d(20);

init();
main();

function init() {
    for (let i = 0; i <= n; i++) {
        arr.push(str[i]);
    }
    prepare();
}

function prepare() {
    nxt[1] = 0; let cur = 0;
    for (let i = 2; i <= n; i++) {
        while (cur && str[cur + 1] !== str[i])
            cur = nxt[cur];
        if (str[cur + 1] === str[i]) nxt[i] = ++cur;
    }
}

async function main() {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        sd.Link(arr.element(i), arr.element(nxt[i]), sd.Curve, "cx", "y", "cx", "y").bending(0.5)
            .startAnimate().pointStoT().endAnimate().arrow();
    }
    await sd.pause();
}