import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const arr = sd.WithBrace(new sd.Array(svg));
const data = I.readIntArray("2 5 4 1 2 3 6 2 4", 9, false);

init();
main();

function init() {
    data.forEach(d => arr.push(d));
}

async function main() {
    function findLeft(x) {
        const S = new Set();
        for (let i = x; i >= 0; i--) {
            if (S.has(data[i]))
                return i + 1;
            S.add(data[i]);
        }
        return 0;
    }
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        const L = findLeft(i);
        const b = arr.brace(L, i, "b", i * 20 + 10).opacity(0);
        arr.startAnimate().color(L, i, C.green).endAnimate();
        await sd.pause();
        b.startAnimate().opacity(1).endAnimate();
        await sd.pause();
        arr.startAnimate().color(C.white).endAnimate();
    }
    await sd.pause();
}