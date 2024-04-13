import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let d = makeDp();

main();

async function main() {
    await d.dp();
}

function makeDp() {
    let self = {};
    let w = [0, 4, 1, 2, 3];
    let v = [0, 5, 1, 4, 2];
    let n = w.length - 1;
    let m = 7;
    let warr = new sd.Array(svg).x(100).y(350).start(1);
    let varr = new sd.Array(svg).x(100).y(410).start(1);
    let circ = new sd.Grid(svg).x(700).y(100).n(2).m(m+1);
    let cur = sd.Pointer(circ, "cur", "r").moveTo(0, 0);
    let lst = sd.Pointer(circ, "lst", "r").moveTo(1, 0);
    let dp = new sd.Grid(svg).n(n+1).m(m+1).x(100).y(100);
    let math = new sd.Mathjax(svg, "F_{i,j}=max\\{F_{i-1,j},F_{i-1,j-v_i}+w_i\\}").height(25).cx(600).y(460);
    math = sd.Stress(math);
    sd.Index(dp, "t");
    sd.Index(dp, "l");
    for (let i = 1; i <= n; i++) {
        warr.push(w[i]);
        varr.push(v[i]);
    }
    sd.Label(warr, "价值");
    sd.Label(varr, "体积");

    self.dp = async function() {
        await sd.pause();
        dp.startAnimate(); circ.startAnimate();
        for (let j = 1; j <= m; j++) {
            dp.color(1, j, C.orange);
            circ.color(1, j, C.orange);
        }
        dp.endAnimate(); circ.endAnimate();
        await sd.pause();
        dp.startAnimate(); circ.startAnimate();
        for (let j = 1; j <= m; j++) {
            dp.value(1, j, (j >= v[1]) ? w[1] : 0);
            circ.value(1, j, (j >= v[1]) ? w[1] : 0);
        }
        dp.endAnimate(); circ.endAnimate();
        await sd.pause();
        dp.startAnimate().color(C.white).endAnimate();
        circ.startAnimate().color(C.white).endAnimate();

        for (let i = 2; i <= n; i++) {
            await sd.pause();
            warr.startAnimate().color(i, C.blue).endAnimate();
            varr.startAnimate().color(i, C.blue).endAnimate();
            await sd.pause();
            lst.startAnimate().moveTo((i&1)^1, 0).endAnimate();
            cur.startAnimate().moveTo((i&1), 0).endAnimate();
            for (let j = 1; j <= m; j++) {
                await sd.pause();
                dp.startAnimate().color(i, j, C.orange).endAnimate();
                circ.startAnimate().color(i&1, j, C.orange).endAnimate();

                let ans = 0;
                dp.startAnimate(); circ.startAnimate();
                if (j - v[i] >= 0) {
                    dp.color(i-1, j-v[i], C.blue);
                    circ.color((i&1)^1, j-v[i], C.blue);
                    if (j - v[i] >= 0) ans = Math.max(ans, dp.intValue(i-1, j-v[i]) + w[i]);
                }
                dp.color(i-1, j, C.blue);
                circ.color((i&1)^1, j, C.blue);
                ans = Math.max(ans, dp.intValue(i-1, j));
                dp.endAnimate(); circ.endAnimate();

                await sd.pause();
                math.startAnimate().stress().endAnimate();
                dp.after(math).startAnimate().value(i, j, ans).endAnimate();
                circ.after(math).startAnimate().value(i&1, j, ans).endAnimate();

                await sd.pause();
                dp.startAnimate().color(C.white).endAnimate();
                circ.startAnimate().color(C.white).endAnimate();
            }
            await sd.pause();
            warr.startAnimate().color(i, C.white).endAnimate();
            varr.startAnimate().color(i, C.white).endAnimate();
        }
    }
    return self;
}