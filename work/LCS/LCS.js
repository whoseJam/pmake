import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let I = sd.input();
let d = makeDp();

main();

async function main() {
    await sd.pause();
    await d.dp();
}

function makeDp() {
    let self = {};
    let strX = "ABCBDAB", strY = "BDCABA";
    let X = new sd.Stack(svg).push();
    let Y = new sd.Array(svg).push();
    let f = sd.make2d(100, 100, 0);
    let n = strX.length, m = strY.length;
    strX = " " + strX;
    strY = " " + strY;
    let dp = makeGrid(svg, n+1, m+1);
    dp.x(500).y(200);
    Y.x(dp.x()).my(dp.y() - 20);
    X.mx(dp.x() - 20).y(dp.y());
    for (let i = 1; i <= n; i++) X.push(strX[i]);
    for (let i = 1; i <= m; i++) Y.push(strY[i]);
    sd.Label(X, "X", "tc");
    sd.Label(Y, "Y");

    self.dp = async function() {
        await sd.pause();
        dp.startAnimate();
        for (let i = 0; i <= n; i++)
            for (let j = 0; j <= m; j++)
                if (i === 0 || j === 0) dp.color(i, j, C.orange);
        dp.endAnimate();
        await sd.pause();
        dp.startAnimate();
        for (let i = 0; i <= n; i++)
            for (let j = 0; j <= m; j++)
                if (i === 0 || j === 0) dp.value(i, j, 0);
        dp.endAnimate();
        await sd.pause();
        dp.startAnimate().color(C.white).endAnimate();
        
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                await sd.pause();
                dp.startAnimate();
                dp.color(i, j, C.orange);
                dp.color(i-1, j, C.blue);
                dp.color(i, j-1, C.blue);
                dp.color(i-1, j-1, C.blue);
                let c = (strX[i] === strY[j]) ? C.green : C.red;
                dp.endAnimate();
                X.startAnimate().color(i, c).endAnimate();
                Y.startAnimate().color(j, c).endAnimate();
                await sd.pause();
                let flg = c === C.green ? 1 : 0;
                f[i][j] = Math.max(f[i][j-1], f[i-1][j]);
                f[i][j] = Math.max(f[i-1][j-1] + flg, f[i][j]);
                if (f[i][j] === f[i-1][j-1] + flg && flg) fill(dp.element(i, j), f[i][j], "fromX");
                else if (f[i][j] === f[i-1][j]) fill(dp.element(i, j), f[i][j], "fromTop");
                else fill(dp.element(i, j), f[i][j], "fromLeft");
                await sd.pause();
                dp.startAnimate().color(C.white).endAnimate();
                X.startAnimate().color(C.white).endAnimate();
                Y.startAnimate().color(C.white).endAnimate();
            }
        }
        await sd.pause();
        dfs(n, m);
        await sd.pause();
    }
    function makeGrid(svg, n, m) { return new sd.Grid(svg).n(n).m(m); }
    function fill(elem, value, dir) {
        let l = new sd.Line(svg);
        let t = new sd.Text(svg).text(value);
        t.mx(elem.mx() - 3).my(elem.my() + 3).fontSize(15);
        if (dir === "fromLeft") l.source(elem.x() + 3, elem.ky(0.75)).target(elem.cx(), elem.ky(0.75));
        else if (dir === "fromTop") l.source(elem.kx(0.75), elem.y() + 3).target(elem.kx(0.75), elem.cy());
        else l.source(elem.x() + 3, elem.y() + 3).target(elem.cx(), elem.cy());
        l.arrow().opacity(0).startAnimate().opacity(1).endAnimate();
        t.opacity(0).startAnimate().opacity(1).endAnimate();
        elem.dir = dir;
    }
    function dfs(i, j) {
        if (i === 0 || j === 0) return;
        let elem = dp.element(i, j);
        let s = dp.delay();
        dp.startAnimate().color(i, j, C.green).endAnimate();
        if (elem.dir === "fromLeft") dfs(i, j-1);
        else if (elem.dir === "fromTop") dfs(i-1, j);
        else {
            X.after(s).startAnimate().color(i, C.green).endAnimate();
            Y.after(s).startAnimate().color(j, C.green).endAnimate();
            dfs(i-1, j-1);
        }
    }
    return self;
}