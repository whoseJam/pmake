import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await sd.pause();
    await d.dp();
    await d.findPath();
}

function makeDp() {
    let self = {};
    let n = 5;
    let data = [
        [],
        [0, 7],
        [0, 3, 8],
        [0, 8, 1, 0],
        [0, 2, 7, 4, 4],
        [0, 4, 5, 2, 6, 5]
    ];
    let tri = makeTriGrid(svg, n);
    let dp = makeTriGrid(svg, n);
    let latex = new sd.Mathjax(svg, "f(i,j)=max\\{f(i-1,j-1),f(i-1,j)\\}+a[i,j]").height(30).cx(600).cy(400);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            tri.value(i, j, data[i][j]);
        }
    }
    tri.x(100).y(100);
    dp.x(600).y(100);
    let owidth = latex.width();
    function highlight() {
        latex.startAnimate(150).width(owidth * 1.2).cx(600).cy(400).endAnimate();
        latex.startAnimate(150).width(owidth).cx(600).cy(400).endAnimate();
    }
    self.dp = async function() {
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= i; j++) {
                await sd.pause();
                dp.startAnimate().color(i, j, C.orange).endAnimate();

                await sd.pause();
                let v = 0;
                dp.startAnimate();
                if (i-1>=1 && j-1>=1) {
                    dp.color(i-1, j-1, C.blue);
                    v = Math.max(v, +dp.value(i-1, j-1).text());
                }
                if (i-1>=1 && j<i) {
                    dp.color(i-1, j, C.blue);
                    v = Math.max(v, +dp.value(i-1, j).text());
                }
                dp.endAnimate();
                tri.startAnimate().color(i, j, C.blue).endAnimate();
                await sd.pause();
                highlight();

                await sd.pause();
                dp.startAnimate().value(i, j, v + data[i][j]).endAnimate();

                await sd.pause();
                dp.startAnimate().color(C.white).endAnimate();
                tri.startAnimate().color(C.white).endAnimate();
            }
        }
        await sd.pause();
    }
    self.findPath = async function() {
        let cur = 0, pos = 0;
        for (let j = 1; j <= n; j++) {
            let tmp = +dp.value(n, j).text();
            if (tmp > cur) {
                cur = tmp;
                pos = j;
            }
        }
        async function dfs(i, j) {
            if (i === 0) return;
            await sd.pause();
            dp.startAnimate().color(i, j, C.green).endAnimate();
            tri.startAnimate().color(i, j, C.green).endAnimate();
            if (j-1>=1 && +dp.value(i, j).text() === +dp.value(i-1, j-1).text() + (+tri.value(i, j).text())) await dfs(i-1, j-1);
            else await dfs(i-1, j);
        }
        await dfs(n, pos);
    }
    function makeTriGrid(svg, n) {
        let tri = new sd.Grid(svg).startN(1).startM(1);
        for (let i = 1; i <= n; i++)
            tri.pushRow(i);
        return tri;
    }
    return self;
}