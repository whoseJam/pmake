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
    let sarr = new sd.Array(svg).x(100).y(470).start(1);
    let circ = new sd.Array(svg).x(700).y(100).resize(m+1);
    let dp = new sd.Grid(svg).n(n+1).m(m+1).x(100).y(100);
    let math = new sd.Mathjax(svg, "F_{i,j}=max\\{F_{i-1,j},F_{i-1,j-v_i}+w_i\\}").height(25).cx(600).y(460);
    math = sd.Stress(math);
    sd.Index(dp, "t");
    sd.Index(dp, "l");
    for (let i = 1; i <= n; i++) {
        warr.push(w[i]);
        varr.push(v[i]);
        sarr.push(new sd.Mathjax(sarr, "+\\infty"));
    }
    sd.Label(warr, "价值");
    sd.Label(varr, "体积");
    sd.Label(sarr, "数量");

    self.dp = async function() {
        for (let i = 1; i <= n; i++) {
            await sd.pause();
            warr.startAnimate().color(i, C.blue).endAnimate();
            varr.startAnimate().color(i, C.blue).endAnimate();
            sarr.startAnimate().color(i, C.blue).endAnimate();
            for (let j = 1; j <= m; j++) {
                await sd.pause();
                dp.startAnimate().color(i, j, C.orange).endAnimate();
                circ.startAnimate().color(j, C.orange).endAnimate();
                await sd.pause();
                
                let t = new sd.HorizontalValueTree(svg).layerWidth(300), ans = 0, tmp, lines = [];
                t.root(-1, tmp=makeBackpack(j, C.blue));
                sd.MathjaxLabel(tmp, `F_{${i}, ${j}}`, "tc");
                dp.startAnimate(); circ.startAnimate();
                let where = [[i-1, j, +0, +0], [i, j-v[i], +v[i], +w[i]]];
                for (let k = 0; k < where.length; k++) {
                    let at = where[k];
                    if (at[1] < 0) continue;
                    if (at[1] !== j) circ.color(at[1], C.blue);
                    let l = sd.Link(
                        circ.element(j-k*v[i]),
                        circ.element(j),
                        sd.CircleCurve,
                        "cx", "y", "cx", "y"
                    ).opacity(0).after(circ).opacity(1).startAnimate().pointTo().endAnimate().arrow();
                    lines.push(l);
                    let cost = at[2];
                    let gain = at[3];

                    t.newNode(k, tmp=makeBackpack(at[1], C.blue));
                    sd.MathjaxLabel(tmp, `F_{${at[0]}, ${at[1]}}=${dp.intValue(at[0], at[1])}`, "rc");
                    t.newLink(-1, k);
                    t.element(-1, k).value(makeSpace(cost, C.red, sd.Box).value(`+${gain}`, R.CenterOnly())).revArrow();
                    ans = Math.max(ans, dp.intValue(at[0], at[1])+gain);
                    dp.color(at[0], at[1], C.blue);
                }
                dp.endAnimate(); circ.endAnimate();
                t.x(600).y(150).height(400).opacity(0).startAnimate().opacity(1).endAnimate();

                await sd.pause();
                math.startAnimate().stress().endAnimate();
                dp.after(math).startAnimate().value(i, j, ans).endAnimate();

                await sd.pause();
                dp.startAnimate().color(C.white).endAnimate();
                circ.startAnimate().color(C.white).endAnimate();
                t.startAnimate().remove();
                for (let l of lines) l.startAnimate().remove();
            }
            await sd.pause();
            warr.startAnimate().color(i, C.white).endAnimate();
            varr.startAnimate().color(i, C.white).endAnimate();
            sarr.startAnimate().color(i, C.white).endAnimate();
        }
    }


    let L = 120, W = 80;

    function makeSpace(size, c, classType=sd.Rect) {
        let k = size / m;
        let r = new classType(svg).height(k * L).width(W - 2).strokeOpacity(0).fill(c);
        if (size > 0) {
            r.childAs("bbb", new sd.Brace(svg), function(parent, child) {
                child.target(parent.x() - 5, parent.y());
                child.source(parent.x() - 5, parent.my());
            });
            r.child("bbb").value(size, R.PointAtPathByRate(0.5, "mx", "cy"));
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

    return self;
}