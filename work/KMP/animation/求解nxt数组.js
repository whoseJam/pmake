import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
let str = " abababaabaababba";
let n = str.length - 1;
let arr = new sd.Array(svg).x(100).y(200);
let nxt = sd.make1d(100, 0);
let rctHead = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let rctTail = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let pntCur = sd.Pointer(arr, "cur");
let pntI = sd.Pointer(arr, "i");

for (let i = 0; i <= n; i++) {
    arr.push(str[i]);
}

main();

async function main() {
    let cur = 0;
    movePointer(pntI, 2);
    movePointer(pntCur, 0);
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        movePointer(pntI, i);
        await sd.pause();
        arr.startAnimate().color(i, C.orange).endAnimate();
        while (true) {
            await sd.pause();
            arr.startAnimate().color(cur + 1, C.blue).endAnimate();
            if (str[cur + 1] === str[i]) {
                await sd.pause();
                arr.startAnimate();
                arr.color(cur + 1, C.green);
                arr.color(i, C.green);
                arr.endAnimate();
                await sd.pause();
                movePointer(pntCur, nxt[i] = ++cur);
                await sd.pause();
                arr.startAnimate();
                arr.color(cur, C.white);
                arr.color(i, C.white);
                arr.endAnimate();
                break;
            } else {
                await sd.pause();
                arr.startAnimate();
                arr.color(cur + 1, C.white);
                arr.endAnimate();
                focus(rctHead, 1, nxt[cur]);
                focus(rctTail, cur - nxt[cur] + 1, cur, 50);
                await sd.pause();
                movePointer(pntCur, cur = nxt[cur]);
                await sd.pause();
                defocus(rctHead);
                defocus(rctTail);
                if (cur === 0 && str[cur + 1] !== str[i]) {
                    await sd.pause();
                    arr.startAnimate();
                    arr.color(i, C.white);
                    arr.endAnimate();
                    break;
                }
            }
        }

    }
}

function focus(rct, l, r, dy = 0) {
    let el = arr.element(l);
    let er = arr.element(r);
    rct.x(el.x()).y(el.y() + dy);
    rct.width(er.mx() - el.x());
    rct.height(el.height());
    rct.stroke(C.red).strokeWidth(3);
    rct.startAnimate().strokeOpacity(1).endAnimate();
}

function defocus(rct) {
    rct.startAnimate().strokeOpacity(0).endAnimate();
}

function movePointer(pointer, to) {
    pointer.startAnimate();
    pointer.moveTo(to);
    pointer.endAnimate();
}