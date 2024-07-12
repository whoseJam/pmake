import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [4, 2, 3, 6, 5, 6, 3, 4];
const arr = new sd.Array(svg).x(100).y(100);

init();
main();

function init() {
    data.forEach(value => arr.push(value));
}

async function main() {
    await sd.pause();
    arr.freeze();
    const group = [];
    for (let i = 0; i < data.length; i++) {
        group.push({
            element: arr.element(0),
            value: arr.intValue(0)
        });
        arr.dropElement(0);
    }
    group.sort((a, b) => a.value - b.value);
    arr.startAnimate();
    for (let i = 0; i < group.length; i++) {
        arr.pushFromExistElement(group[i].element);
    }
    arr.unfreeze();
    arr.endAnimate();
    await sd.pause();
    const focusFront = sd.Focus(arr).stroke(C.deepSkyBlue);
    const focus = sd.Focus(arr);
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && arr.intValue(r + 1) === arr.intValue(l))
            r++;
        await sd.pause();
        focus.startAnimate().focus(l, r).endAnimate();
        if (l - 1 >= 0) {
            await sd.pause();
            focusFront.startAnimate().focus(0, l - 1).endAnimate();
        }
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
        focusFront.startAnimate().focus(null).endAnimate();
    }
    await sd.pause();
}