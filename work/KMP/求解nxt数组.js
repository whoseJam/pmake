import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let str = " abababaabaababba";
let n = str.length - 1;
let arr = new sd.Array(svg).indexed(true).x(100).y(200);
let nxt = sd.make1d(100, 0);
let rctHead = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let rctTail = new sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
let pntCur = makePointer("cur");
let pntI = makePointer("i");

for (let i = 0; i <= n; i++) {
    arr.push(str[i]);
}

main();

async function main() {
    let cur = 0;
    movePointer(pntI, 2);
    movePointer(pntCur, 0);
    for (let i = 2; i <= n; i++) {
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