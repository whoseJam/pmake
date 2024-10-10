import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
let str = " ababab";
const text = " abababaabababab";
const n = str.length - 1;
const m = text.length - 1;
const A = sd.WithBrace(new sd.Array(svg).x(100).y(150).resize(n + 1));
const B = new sd.Array(svg).x(100).y(280);
const nxt = sd.make1d(100, 0);
const rangeF = A.brace(1, 1, "b", 10).opacity(0);
const rangeB = A.brace(1, 1, "b", 20).opacity(0);
const pntCur = sd.Pointer(A, "cur", "b", 10, 20);
const pntI = sd.Pointer(B, "i", "b", 10, 20);

init();
main();

function init() {
    for (let i = 0; i <= n; i++) A.value(i, str[i]); A.push(); str = str + "#";
    for (let i = 0; i <= m; i++) B.push(text[i]);
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
    let cur = 0;
    pntCur.moveTo(0);
    for (let i = 1; i <= m; i++) {
        await sd.pause();
        pntI.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        B.startAnimate().color(i, C.orange).endAnimate();
        while (true) {
            await sd.pause();
            A.startAnimate().color(cur + 1, C.blue).endAnimate();
            if (str[cur + 1] === text[i]) {
                await sd.pause();
                A.startAnimate().color(cur + 1, C.green).endAnimate();
                B.startAnimate().color(i, C.green).endAnimate();
                await sd.pause();
                pntCur.startAnimate().moveTo(++cur).endAnimate();
                await sd.pause();
                A.startAnimate().color(C.white).endAnimate();
                B.startAnimate().color(C.white).endAnimate();
                break;
            } else {
                await sd.pause();
                A.startAnimate().color(cur + 1, C.white).endAnimate();
                rangeF.brace(1, nxt[cur]).startAnimate().opacity(1).endAnimate();
                rangeB.brace(cur - nxt[cur] + 1, cur).startAnimate().opacity(1).endAnimate();
                await sd.pause();
                pntCur.startAnimate().moveTo(cur = nxt[cur]).endAnimate();
                await sd.pause();
                rangeF.startAnimate().opacity(0).endAnimate();
                rangeB.startAnimate().opacity(0).endAnimate();
                if (cur === 0 && str[cur + 1] !== text[i]) {
                    await sd.pause();
                    B.startAnimate().color(C.white).endAnimate();
                    break;
                }
            }
        }

    }
}

function focus(rct, arr, l, r, dy = 0) {
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