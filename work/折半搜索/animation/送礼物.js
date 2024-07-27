import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 5;
const W = 20;
const data = I.readIntArray("7 5 4 18 1", n, false);
const maxW = new sd.Text(svg, `W = ${W}`);
console.log("data=", data);

const arr1 = new sd.Array(svg);
const arr2 = new sd.Array(svg);

init();
main();

function init() {
    const mid = Math.floor(n / 2);
    for (let i = 0; i < mid; i++)
        arr1.push(data[i]);
    for (let i = mid; i < n; i++) {
        arr2.push(data[i]);
    }
    arr1.x(100).y(100);
    arr2.x(arr1.mx()).y(arr1.y());
    maxW.cx((arr1.x() + arr2.mx())/2).my(arr1.y() - 20);
}

async function main() {
    await sd.pause();
    arr1.startAnimate().dx(-50).endAnimate();
    arr2.startAnimate().dx(50).endAnimate();
    await sd.pause();

    const stk1 = new sd.Stack(arr1).elementWidth(80).elementHeight(20);
    arr1.childAs("stk", stk1, R.Aside("bc", 30));
    const stk2 = new sd.Stack(arr2).elementWidth(80).elementHeight(20);
    arr2.childAs("stk", stk2, R.Aside("bc", 30));

    arr1.startAnimate(); dfs(arr1, 0, 0); arr1.endAnimate();
    arr2.startAnimate(); dfs(arr2, 0, 0); arr2.endAnimate();
    await sd.pause();
    stk1.startAnimate().sort().endAnimate();
    stk2.startAnimate().sort().endAnimate();
    
    for (let i = 0; i < stk1.length(); i++) {
        await sd.pause();
        stk1.startAnimate().color(i, C.orange).endAnimate();
        for (let j = stk2.length() - 1; j >= 0; j--) {
            if (stk2.intValue(j) + stk1.intValue(i) <= W) {
                await sd.pause();
                stk2.startAnimate().color(j, C.orange).endAnimate();
                await sd.pause();
                stk2.startAnimate().color(j, C.white).endAnimate();
                break;
            }
        }
        await sd.pause();
        stk1.startAnimate().color(i, C.white).endAnimate();
    }
    await sd.pause();
}

function dfs(arr, dep, cur) {
    if (dep === arr.length()) {
        arr.child("stk").push(cur);
        return;
    }
    dfs(arr, dep + 1, cur);
    dfs(arr, dep + 1, cur + arr.intValue(dep));
}