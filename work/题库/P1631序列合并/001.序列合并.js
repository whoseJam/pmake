import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 3;
let A = [0, 2, 6, 6];
let B = [0, 1, 4, 8];
let AArr = sd.Array(svg).x(260).y(150).start(1).drag(true).resizeable(true);
let BArr = sd.Array(svg).x(760).y(150).start(1).drag(true).resizeable(true);
let ansSeq = sd.Array(svg).x(260).y(500).drag(true).resizeable(true);
let q = sd.Array(svg).elementWidth(70).elementHeight(100).x(260).y(260).drag(true).resizeable(true);
for (let i = 1; i <= n; i++) {
    AArr.push(A[i]);
    BArr.push(B[i]);
}
sd.EnableArrayName(AArr, "A数组");
sd.EnableArrayName(BArr, "B数组");
sd.EnableArrayName(ansSeq, "答案数组");
sd.EnableArrayName(q, "优先队列");

main();

async function main() {
    for (let i = 1; i <= n; i++) {
        await push(info(i, 1));
    }
    for (let i = 1; i <= n; i++) {
        let ans = await topAndPop();
        let posA = ans.posA;
        let posB = ans.posB;
        await sd.pause();
        ansSeq.startAnimate().push(ans.sum).endAnimate();
        if (posB + 1 <= n) {
            await push(info(posA, posB + 1));
        }
        await sd.pause();
        ans.startAnimate().opacity(0).endAnimate().remove();
    }
}

async function topAndPop() {
    let curInfo = q.value(0);
    let posA = curInfo.posA;
    let posB = curInfo.posB;
    await sd.pause();
    q.startAnimate().color(0, C.red).endAnimate();
    await sd.pause();
    let ansInfo = info(posA, posB);
    ansInfo.x(760).y(260).width(60).height(100).opacity(0).drag(true);
    ansInfo.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    q.startAnimate().erase(0).endAnimate();
    return ansInfo;
}

async function push(info) {
    await sd.pause();
    AArr.startAnimate().color(info.posA, C.red).endAnimate();
    BArr.startAnimate().color(info.posB, C.red).endAnimate();
    await sd.pause();
    let i = 0, flag = false;
    q.startAnimate();
    for (; i < q.length(); i++) {
        if (q.value(i).sum > info.sum) {
            q.insert(i, info);
            flag = true;
            break;
        }
    }
    if (!flag) q.push(info);
    q.endAnimate();
    await sd.pause();
    AArr.startAnimate().color(info.posA, C.white).endAnimate();
    BArr.startAnimate().color(info.posB, C.white).endAnimate();
}

function info(posA, posB) {
    let sum = A[posA] + B[posB];
    let rct = sd.Rect(svg).fillOpacity(0).strokeOpacity(0);
    let t1 = sd.Text(rct, `posA=${posA}`);
    let t2 = sd.Text(rct, `posB=${posB}`);
    let t3 = sd.Text(rct, `sum=${sum}`);
    rct.children.push(t1, () => {
        t1.cx(rct.cx()).cy(rct.y() + rct.height() * 1 / 6); });
    rct.children.push(t2, () => {
        t2.cx(rct.cx()).cy(rct.y() + rct.height() * 3 / 6); });
    rct.children.push(t3, () => {
        t3.cx(rct.cx()).cy(rct.y() + rct.height() * 5 / 6); });
    rct.sum = sum;
    rct.posA = posA;
    rct.posB = posB;
    rct.opacity(0);
    return rct;
}
