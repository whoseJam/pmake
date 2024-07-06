import * as sd from "../@/SD";

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
    result.length(length).cx(800).cy(300);
    sd.Label(result, "result");
    result.opacity(0);
    ori.cx(400).y(50);

    self.dfs = async function dfs(pos, is4, lim) {
        if (pos === 0) {
            await sd.pause();
            showResult();
            await sd.pause();
            hideResult();
            return 1;
        }
        await sd.pause();
        showStatusOf(pos, is4, lim);
        let arr = sta[pos][is4][lim].arr;

        if (vis[pos][is4][lim]) {
            await returnF(pos, is4, lim);
            await sd.pause();
            hideStatusOf(pos, is4, lim);
            return f[pos][is4][lim];
        }
        let up = (lim ? ori.intValue(offset(pos)) : 9);
        let ans = 0;
        for (let i = 0, nxt; i <= up; i++) {
            if (is4 && i === 9) continue;

            await sd.pause();
            arr.startAnimate().value(offset(pos), i).endAnimate();
            resultList[pos] = i;

            ans += await dfs(pos - 1, i === 4 ? 1 : 0, lim && i === up);

            await sd.pause();
            changeF(pos, is4, lim, ans);
        }
        vis[pos][is4][lim] = 1;
        f[pos][is4][lim] = ans;

        await returnF(pos, is4, lim);
        await sd.pause();
        hideStatusOf(pos, is4, lim);

        return f[pos][is4][lim];
    }

    function showResult() {
        for (let i = length; i >= 1; i--)
            result.value(offset(i), resultList[i]);
        result.startAnimate().opacity(1).endAnimate();
    }

    function hideResult() {
        result.startAnimate().opacity(0).endAnimate();
    }

    function hideStatusOf(pos, is4, lim) {
        let tmp = sta[pos][is4][lim];
        for (let i of ["arr", "pointer", "f"])
            tmp[i].startAnimate().opacity(0).endAnimate();
    }

    function showStatusOf(pos, is4, lim) {
        if (!vis[pos][is4][lim]) {
            let arr = new sd.Array(svg).start(1).length(length).mx(ori.mx()).y((length - pos + 1) * 120 + ori.y());
            let pointer = sd.Pointer(arr, "pos", "b", 5, 20).moveTo(offset(pos));
            let f = new sd.VarList(arr).put("f", 0).x(600).y(100);
            sd.Label(arr, `pos=${pos} is4=${is4} lim=${lim}`, "lc");
            arr.childAs("f", f, function(parent, child) {
                child.x(parent.mx() + 10).cy(parent.cy());
            });
            sta[pos][is4][lim] = {
                arr: arr,
                pointer: pointer,
                f: f
            };
            arr.opacity(0);
        }
        let tmp = sta[pos][is4][lim];
        tmp.arr.startAnimate().opacity(1).value(offset(pos), "?").endAnimate();
        tmp.pointer.after(0).startAnimate().opacity(1).endAnimate();
        tmp.f.after(0).startAnimate().opacity(1).endAnimate();
    }

    function changeF(pos, is4, lim, newF) {
        let tmp = sta[pos][is4][lim];
        tmp.f.startAnimate().put("f", newF).endAnimate();
    }

    async function returnF(pos, is4, lim) {
        let tmp = sta[pos][is4][lim];
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
        ori.length(length = cnt); tmp = x;
        while (tmp > 0) {
            ori.value(cnt, tmp % 10);
            tmp = Math.floor(tmp / 10);
            cnt--;
        }
    }
    return self;
}