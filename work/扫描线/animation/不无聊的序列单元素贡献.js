import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [2, 4, 3, 4, 6, 2, 3, 4];
const arr = new sd.Array(svg);

init();
main();

function init() {
    data.forEach(d => arr.push(d));
}

async function main() {
    await sd.pause();

    const focus = sd.Focus(arr);
    for (let i = 0; i < data.length; i++) {
        let l = i, r = i;
        while (l - 1 >= 0 && data[l - 1] !== data[i]) l--;
        while (r + 1 < data.length && data[r + 1] !== data[i]) r++;

        await sd.pause();
        focus.startAnimate().focus(i).endAnimate();
        await sd.pause();
        arr.startAnimate().color(l, r, C.green).endAnimate();
        await sd.pause();
        arr.startAnimate().color(l, r, C.white).endAnimate();
    }
}