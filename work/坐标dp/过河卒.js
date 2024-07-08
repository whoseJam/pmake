import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await sd.pause();
    await d.dp();
}

function makeDp() {
    let self = {};
    let n = 5, m = 9;
    let dx = [1, 1, 2, 2, -1, -1, -2, -2, 0];
    let dy = [2, -2, 1, -1, 2, -2, 1, -1, 0];
    let cx = 4, cy = 3;
    let mp = makeGrid(svg, n, m);
    let latex = new sd.Mathjax(svg, "f(i,j)=f(i,j-1)+f(i-1,j)").height(30).cx(600).cy(400);
    for (let i = 0; i < 9; i++) {
        let tx = cx + dx[i];
        let ty = cy + dy[i];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= m)
            mp.value(tx, ty, new sd.Circle(svg).color(C.ORANGE));
    }
    mp.cx(600).y(100);
    let owidth = latex.width();
    function highlight() {
        latex.startAnimate(150).width(owidth * 1.2).cx(600).cy(400).endAnimate();
        latex.startAnimate(150).width(owidth).cx(600).cy(400).endAnimate();
    }
    self.dp = async function() {
        await sd.pause();
        mp.startAnimate().color(1, 1, C.blue).endAnimate();
        await sd.pause();
        mp.startAnimate().value(1, 1, 1).endAnimate();
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                if (mp.value(i, j)) continue;
                await sd.pause();
                mp.startAnimate();
                mp.color(i, j, C.orange);
                let ans = 0;
                if (i-1 >= 1 && mp.value(i-1, j).text) ans += +mp.value(i-1, j).text(), mp.color(i-1, j, C.blue);
                if (j-1 >= 1 && mp.value(i, j-1).text) ans += +mp.value(i, j-1).text(), mp.color(i, j-1, C.blue);
                mp.endAnimate();
                await sd.pause();
                highlight();
                await sd.pause();
                mp.value(i, j, ans);
                await sd.pause();
                mp.startAnimate().color(C.white).endAnimate();
            }
        }
        await sd.pause();
    }
    function makeGrid(svg, n, m) {
        let tri = new sd.Grid(svg).startN(1).startM(1).n(n).m(m);
        return tri;
    }
    return self;
}