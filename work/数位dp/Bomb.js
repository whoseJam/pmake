import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    let t = await d.dfs(4, 0, true);
    console.log("t = ", t);
}

function makeDp() {
    let self = {};
    let n = 3514, length;
    let f = sd.make3d(10, 3, 2);
    let vis = sd.make3d(10, 3, 2);
    let sta = sd.make3d(10, 3, 2);
    let ori = new sd.Array(svg).start(1);
    let result = new sd.Array(svg).start(1);
    let resultList = sd.make1d(10);
    divide(n);
    result.resize(length).cx(800).cy(300);
    sd.Label(result, "result");
    result.opacity(0);
    ori.cx(400).y(50);

    self.dfs = async function dfs(pos, flg, lim) {
        if (pos === 0) {
            await sd.pause();
            showResult();
            await sd.pause();
            hideResult();
            return (flg === 2) ? 1 : 0;
        }
        await sd.pause();
        showStatusOf(pos, flg, lim);
        let arr = sta[pos][flg][lim].arr;

        if (vis[pos][flg][lim]) {
            await returnF(pos, flg, lim);
            await sd.pause();
            hideStatusOf(pos, flg, lim);
            return f[pos][flg][lim];
        }
        let up = (lim ? ori.intValue(offset(pos)) : 9);
        let ans = 0;
        for (let i = 0, nxt; i <= up; i++) {
            if (flg === 2 || (flg === 1 && i === 9)) nxt = 2;
            else if (i === 4) nxt = 1;
            else nxt = 0;

            await sd.pause();
            arr.startAnimate().value(offset(pos), i).endAnimate();
            resultList[pos] = i;

            ans += await dfs(pos - 1, nxt, lim && i === up);

            await sd.pause();
            changeF(pos, flg, lim, ans);
        }
        vis[pos][flg][lim] = 1;
        f[pos][flg][lim] = ans;

        await returnF(pos, flg, lim);
        await sd.pause();
        hideStatusOf(pos, flg, lim);

        return f[pos][flg][lim];
    }

    function showResult() {
        for (let i = length; i >= 1; i--)
            result.value(offset(i), resultList[i]);
        result.startAnimate().opacity(1).endAnimate();
    }

    function hideResult() {
        result.startAnimate().opacity(0).endAnimate();
    }

    function hideStatusOf(pos, flg, lim) {
        let tmp = sta[pos][flg][lim];
        for (let i of ["arr", "pointer", "f"])
            tmp[i].startAnimate().opacity(0).endAnimate();
    }

    function showStatusOf(pos, flg, lim) {
        if (!vis[pos][flg][lim]) {
            let arr = new sd.Array(svg).start(1).resize(length).mx(ori.mx()).y((length - pos + 1) * 120 + ori.y());
            let pointer = sd.Pointer(arr, "pos", "b", 5, 20).moveTo(offset(pos));
            let f = new sd.VarList(arr).put("f", 0).x(600).y(100);
            sd.Label(arr, `pos=${pos} flg=${flg} lim=${lim}`, "lc");
            arr.childAs("f", f, function(parent, child) {
                child.x(parent.mx() + 10).cy(parent.cy());
            });
            sta[pos][flg][lim] = {
                arr: arr,
                pointer: pointer,
                f: f
            };
            arr.opacity(0);
        }
        let tmp = sta[pos][flg][lim];
        tmp.arr.startAnimate().opacity(1).value(offset(pos), "?").endAnimate();
        tmp.pointer.after(0).startAnimate().opacity(1).endAnimate();
        tmp.f.after(0).startAnimate().opacity(1).endAnimate();
    }

    function changeF(pos, flg, lim, newF) {
        let tmp = sta[pos][flg][lim];
        tmp.f.startAnimate().put("f", newF).endAnimate();
    }

    async function returnF(pos, flg, lim) {
        let tmp = sta[pos][flg][lim];
        await sd.pause();
        tmp.f.startAnimate().color(C.red).endAnimate();
        await sd.pause();
        tmp.f.startAnimate().color(C.black).endAnimate();
    }

    function offset(x) {
        return length - x + 1;
    }
    function divide(x) {
        let tmp = x, cnt = 0;
        while (tmp > 0) { tmp = Math.floor(tmp / 10); cnt++; }
        ori.resize(length = cnt); tmp = x;
        while (tmp > 0) {
            ori.value(cnt, tmp % 10);
            tmp = Math.floor(tmp / 10);
            cnt--;
        }
    }
    return self;
}