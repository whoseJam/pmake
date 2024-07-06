import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let str = " ababab";
let text = " abababaabababab";
let n = str.length - 1;
let m = text.length - 1;
let A = new sd.Array(svg).indexed(true).x(100).y(150);
let B = new sd.Array(svg).indexed(true).x(100).y(400);
let nxt = sd.make1d(100, 0);
let rctHead = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let rctTail = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let pntCur = makePointer("cur");
let pntI = makePointer("i");

for (let i = 0; i <= n; i++) A.push(str[i]); A.push(); str = str + "#";
for (let i = 0; i <= m; i++) B.push(text[i]);

function prepare() {
    nxt[1] = 0; let cur = 0;
    for (let i = 2; i <= n; i++) {
        while (cur && str[cur + 1] !== str[i])
            cur = nxt[cur];
        if (str[cur + 1] === str[i]) nxt[i] = ++cur;
    }
    for (let i = 1; i <= n; i++) {
        console.log("i=", i, "nxt=", nxt[i]);
    }
}

prepare();
main();

async function main() {

    let cur = 0;
    movePointer(pntI, B, 1);
    movePointer(pntCur, A, 0);
    for (let i = 1; i <= m; i++) {
        movePointer(pntI, B, i);
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
                movePointer(pntCur, A, ++cur);
                await sd.pause();
                A.startAnimate().color(cur, C.white).endAnimate();
                B.startAnimate().color(i, C.white).endAnimate();
                break;
            } else {
                await sd.pause();
                A.startAnimate().color(cur + 1, C.white).endAnimate();
                focus(rctHead, A, 1, nxt[cur]);
                focus(rctTail, A, cur - nxt[cur] + 1, cur, 50);
                await sd.pause();
                movePointer(pntCur, A, cur = nxt[cur]);
                await sd.pause();
                defocus(rctHead);
                defocus(rctTail);
                if (cur === 0 && str[cur + 1] !== text[i]) {
                    await sd.pause();
                    B.startAnimate().color(i, C.white).endAnimate();
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

function movePointer(pointer, arr, to) {
    let e = arr.element(to);
    pointer.startAnimate();
    pointer.cx(e.cx()).my(e.y() - 50);
    pointer.endAnimate();
}

function makePointer(label) {
    let ans = new sd.Line(svg).source(0, 0).target(0, 50).arrow();
    let tmp = new sd.Text(svg, label).fontSize(20);
    ans.children.push(tmp, function(parent, child) {
        tmp.cx(ans.cx()).my(ans.y() - 10).opacity(1);
    });
    return ans;
}