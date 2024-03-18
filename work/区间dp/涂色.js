import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await d.dp();
}

function makeDp() {
    let self = {};
    let data = " RRGBGGR";
    // let data = [0, 2, 3, 4, 5];
    let n = data.length - 1;
    let math = sd.Stress(new sd.Mathjax(svg, "F_{l,r}=\\underset{1\\le k\\lt r}{min}\\{F_{l,k}+F_{k+1,r}+p[l]p[k+1]p[r+1]\\}").height(35).x(500).cy(400));
    let matrix = new sd.ValueArray(svg).y(100).start(1).elementWidth(100).elementHeight(60);
    let dp = new sd.Grid(svg).n(n-1).m(n-1).x(100).y(250).startN(1).startM(1);
    for (let i = 1; i <= n-1; i++) matrix.push(makeMatrix(matrix, getMatrixRows(i), getMatrixCols(i)));
    matrix.cx(math.cx());
    sd.Index(dp, "t");
    sd.Index(dp, "l");
    sd.Label(dp, "L", "lc", 20, 20);
    sd.Label(dp, "R", "tc", 20, 20);
    console.log("box=", matrix.x(), matrix.y(), matrix.width(), matrix.height());

    self.dp = async function() {
        let MAXN = n - 1;
        for (let i = 1; i <= MAXN; i++) {
            await sd.pause();
            dp.startAnimate().color(i, i, C.orange).endAnimate();
            matrix.startAnimate().color(i, C.blue).endAnimate();
            await sd.pause();
            dp.startAnimate().value(i, i, 0).endAnimate();
            await sd.pause();
            dp.startAnimate().color(C.white).endAnimate();
            matrix.startAnimate().color(C.white).endAnimate();
        }
        for (let len = 2; len <= MAXN; len++) {
            for (let i = 1; i + len - 1 <= MAXN; i++) {
                await sd.pause();
                let j = i + len - 1;
                dp.startAnimate().color(i, j, C.orange).endAnimate();
                for (let k = i; k < j; k++) {
                    await sd.pause();
                    let o1 = matrixMul(matrix.element(i), matrix.element(k));
                    let o2 = matrixMul(matrix.element(k+1), matrix.element(j));
                    let o3 = matrixMul(o1.matrix, o2.matrix);
                    dp.startAnimate().color(i,k,C.blue).color(k+1,j,C.blue).endAnimate();
                    await sd.pause();
                    math.startAnimate().stress().endAnimate();
                    let cur = dp.intValue(i,k) + dp.intValue(k+1,j) + data[i]*data[k+1]*data[j+1];
                    if (k > i) cur = Math.min(cur, dp.intValue(i, j)); 
                    dp.startAnimate().value(i, j, cur).endAnimate();
                    await sd.pause();
                    dp.startAnimate().color(i,k,C.white).color(k+1,j,C.white).endAnimate();
                    o1.remove();
                    o2.remove();
                    o3.remove();
                }
                await sd.pause();
                dp.startAnimate().color(i, j, C.white).endAnimate();
            }
        }
        await sd.pause();
    }
    function getMatrixCols(i) {
        return data[i+1];
    }
    function getMatrixRows(i) {
        return data[i];
    }
    function matrixMul(m1, m2) {
        let m = makeMatrix(svg, m1.n(), m2.m());
        let b = makeBrace(m1, m2);
        m.y(b.my() + 5).cx(b.cx());
        m.opacity(0).startAnimate().opacity(1).endAnimate();
        return {
            remove: function() {
                m.startAnimate().remove();
                b.startAnimate().remove();
            },
            matrix: m
        };
    }
    function makeBrace(el, er) {
        let y = Math.max(el.my(), er.my());
        let b = new sd.Brace(svg).source(er.mx()-1, y + 10).target(el.x()+1, y + 10);
        b.opacity(0).startAnimate().opacity(1).endAnimate();
        return b;
    }
    function makeMatrix(node, n, m) { return new sd.Grid(node).startN(1).startM(1).n(n).m(m).elementWidth(10).elementHeight(10); }
    return self;
}