import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await d.dp();
}

function makeDp() {
    let self = {};
    let n = 6;
    let data = [0, 4, 2, 6, 3, 1, 2];
    let stone = new sd.Array(svg).x(150).y(100).start(1);
    let dp = makeGrid(svg, n, n).x(150).y(200);
    for (let i = 1; i <= n; i++) stone.push(data[i]);
    sd.Index(dp, "t");
    sd.Index(dp, "l");
    sd.Label(dp, "L", "lc", 20, 20);
    sd.Label(dp, "R", "tc", 20, 20);

    function sum(l, r) {
        let ans = 0;
        for (let i = l; i <= r; i++)
            ans += data[i];
        return ans;
    }

    self.dp = async function() {
        for (let i = 1; i <= n; i++) {
            await sd.pause();
            dp.startAnimate().color(i, i, C.orange).endAnimate();
            stone.startAnimate().color(i, C.blue).endAnimate();
            await sd.pause();
            dp.startAnimate().value(i, i, 0).endAnimate();
            await sd.pause();
            dp.startAnimate().color(C.white).endAnimate();
            stone.startAnimate().color(C.white).endAnimate();
        }
        for (let len = 2; len <= n; len++) {
            for (let i = 1; i + len - 1 <= n; i++) {
                await sd.pause();
                let j = i + len - 1;
                let now = braceTop(i, j);
                dp.startAnimate().color(i, j, C.orange).endAnimate();
                for (let k = i; k < j; k++) {
                    await sd.pause();
                    let b1 = braceBottom(i, k);
                    let b2 = braceBottom(k+1, j);
                    dp.startAnimate().color(i, k, C.blue).color(k+1, j, C.blue).endAnimate();
                    await sd.pause();
                    if (dp.intValue(i,j) < dp.intValue(i,k) + dp.intValue(k+1,j) + sum(i,j)) {
                        dp.startAnimate().value(i,j,dp.intValue(i,k) + dp.intValue(k+1,j) + sum(i,j));
                    }
                    await sd.pause();
                    dp.startAnimate().color(i, k, C.white).color(k+1, j, C.white).endAnimate();
                    b1.startAnimate().remove();
                    b2.startAnimate().remove();
                }

                await sd.pause();
                dp.startAnimate().color(i,j,C.white).endAnimate();
                now.startAnimate().remove();
            }
        }
        await sd.pause();
    }
    function braceTop(l, r) {
        let el = stone.element(l);
        let er = stone.element(r);
        let b = new sd.Brace(svg).source(el.x()+1, el.y() - 10).target(er.mx()-1, er.y() - 10);
        b.opacity(0).startAnimate().opacity(1).endAnimate();
        return b;
    }
    function braceBottom(l, r) {
        let el = stone.element(l);
        let er = stone.element(r);
        let b = new sd.Brace(svg).source(er.mx()-1, er.my() + 10).target(el.x()+1, el.my() + 10);
        b.opacity(0).startAnimate().opacity(1).endAnimate();
        return b;
    }
    function makeGrid(svg, n, m) { return new sd.Grid(svg).startN(1).startM(1).n(n).m(m); }
    return self;
}