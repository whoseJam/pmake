import * as sd from "@/sd";

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
        dp.startAnimate();
        for (let j = 1; j <= m; j++)
            dp.color(1, j, C.orange);
        dp.endAnimate();
        await sd.pause();
        dp.startAnimate();
        for (let j = 1; j <= m; j++)
            dp.value(1, j, (j >= v[1]) ? w[1] : 0);
        dp.endAnimate();
        await sd.pause();
        dp.startAnimate().color(C.white).endAnimate();

        for (let i = 2; i <= n; i++) {
            await sd.pause();
            warr.startAnimate().color(i, C.blue).endAnimate();
            varr.startAnimate().color(i, C.blue).endAnimate();
            for (let j = 1; j <= m; j++) {
                await sd.pause();
                dp.startAnimate().color(i, j, C.orange).endAnimate();
                let trans = makeTrans(i, j);
                let ans = 0;
                dp.startAnimate();
                if (j - v[i] >= 0) {
                    dp.color(i-1, j-v[i], C.blue);
                    if (j - v[i] >= 0) ans = Math.max(ans, dp.intValue(i-1, j-v[i]) + w[i]);
                }
                dp.color(i-1, j, C.blue);
                ans = Math.max(ans, dp.intValue(i-1, j));
                dp.endAnimate();

                await sd.pause();
                math.startAnimate().stress().endAnimate();
                dp.after(math).startAnimate().value(i, j, ans).endAnimate();

                await sd.pause();
                dp.startAnimate().color(C.white).endAnimate();
                trans.clear();
            }
            await sd.pause();
            warr.startAnimate().color(i, C.white).endAnimate();
            varr.startAnimate().color(i, C.white).endAnimate();
        }
    }


    let L = 120, W = 80;

    function makeSpace(size, c, classType=sd.Rect) {
        let k = size / m;
        let r = new classType(svg).height(k * L).width(W - 2).strokeOpacity(0).fill(c);
        if (size > 0) {
            r.childAs("bbb", new sd.BraceCurve(svg), function(parent, child) {
                child.target(parent.x() - 5, parent.y());
                child.source(parent.x() - 5, parent.my());
            });
            r.child("bbb").value(size, R.pointAtPathByRate(0.5, "mx", "cy"));
        }
        return r;
    }

    function makeBackpack(size, c) {
        let k = size / m;
        let r1 = new sd.Rect(svg).height(L).width(W).fillOpacity(0);
        r1.childAs("inner", makeSpace(size, c), function(parent, child) {
            child.my(parent.my()).cx(parent.cx());
        })
        return r1;
    }

    function makeTrans(i, j) {
        let X = 600, Y = 100, Layer = 300;
        let b1 = makeBackpack(j, C.blue);
        let b2 = j - v[i] >= 0 ? makeBackpack(j - v[i], C.blue) : null;
        let b3 = makeBackpack(j, C.blue);
        let r = b2 ? makeSpace(v[i], C.red, sd.Box).value("+" + w[i], R.centerOnly()) : null;
        if (b2) { b1.x(X).y(Y); b2.x(X).y(Y+200); b3.x(X+Layer).y(Y+100); }
        else { b1.x(X).y(Y+100); b3.x(X+Layer).y(Y+100); }
        sd.Label(b1, new sd.Mathjax(svg, `F_{i-1,j}=${dp.intValue(i-1, j)}`), "tc", 20, 5);
        if (b2) sd.Label(b2, new sd.Mathjax(svg, `F_{i-1,j-v_i}=${dp.intValue(i-1, j-v[i])}`), "tc", 20, 5);
        b1.opacity(0).startAnimate().opacity(1).endAnimate();
        if (b2) b2.opacity(0).startAnimate().opacity(1).endAnimate();
        b3.opacity(0).startAnimate().opacity(1).endAnimate();
        let l1 = linkTo(b1, b3);
        let l2 = b2 ? linkTo(b2, b3, r) : null;
        l1.opacity(0).startAnimate().opacity(1).endAnimate();
        if (l2) l2.opacity(0).startAnimate().opacity(1).endAnimate();
        return {
            clear: function() {
                b1.startAnimate().remove();
                if (b2) b2.startAnimate().remove();
                b3.startAnimate().remove();
                l1.startAnimate().remove();
                if (l2) l2.startAnimate().remove();
            }
        };
    }

    function linkTo(from, to, value = null) {
        let l = new sd.Line(svg);
        l.source(from.cx(), from.cy());
        l.target(to.cx(), to.cy());
        sd.trim(l, from, to);
        l.value(value).arrow();
        return l;
    }

    return self;
}