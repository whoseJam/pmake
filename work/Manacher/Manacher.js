import * as sd from "@/sd";

const svg = sd.svg();
const data = "abbabbabaaaba";
const str = new sd.Array(svg);
const p = sd.make1d(100, 1);

init();
main();

function init() {
    for (let i = 0; i < data.length; i++) {
        str.push(data[i]);
    }
    str.cx(600).cy(300);
}

async function main() {
    await sd.pause();
    str.startAnimate();
    str.insert(0, "{");
    for (let i = 1; i < data.length; i++) {
        str.insert(i * 2, "#");
    }
    str.push("}").cx(600).endAnimate();
    await sd.pause();

    let Max = 0, pos = 0;

    const pI = sd.Pointer(str, "i");
    const pPos = sd.Pointer(str, "pos");
    let posBound = drawBound(0, 40);

    pPos.startAnimate().moveTo(0).endAnimate();
    for (let i = 1; i < str.length(); i++) {
        await sd.pause();
        pI.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        
        let lastBound = null;
        if (Max > i) {
            await sd.pause();
            lastBound = drawBound(pos * 2 - i, 20);
            p[i] = Math.min(p[pos * 2 - i], Max - i);
        } else p[i] = 1;
        await sd.pause();

        let curBound = drawBound(i, 60);
        if (lastBound) {
            await sd.pause();
            lastBound.startAnimate().opacity(0).remove();
        }
    

        while (str.text(i + p[i]) == str.text(i - p[i])) {
            p[i]++;
            await sd.pause();
            expand(i, curBound, 60);
        }
        
        if (Max < i + p[i]) {
            Max = i + p[i];
            pos = i;
            await sd.pause();
            pPos.startAnimate().moveTo(i).endAnimate();
            expand(i, posBound, 40);
        }
        
        await sd.pause();
        curBound.startAnimate().opacity(0).remove();
    }
}

function drawBound(i, gap) {
    const l = str.element(i - p[i] + 1);
    const r = str.element(i + p[i] - 1);
    const minX = l.x();
    const maxX = r.mx();
    return new sd.Brace(svg)
        .target(minX, str.my() + gap)
        .source(maxX, str.my() + gap)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
}

function expand(i, bound, gap) {
    const l = str.element(i - p[i] + 1);
    const r = str.element(i + p[i] - 1);
    const minX = l.x();
    const maxX = r.mx();
    bound.startAnimate()
        .target(minX, str.my() + gap)
        .source(maxX, str.my() + gap)
        .endAnimate();
}