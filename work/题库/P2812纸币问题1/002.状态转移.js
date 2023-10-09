import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let coin = sd.ValueStack(svg).start(1).x(700).y(160).drag(true).resizeable(true);
let data = [0, 1, 3, 3, 2, 4, 7, 1];
let n = 7, m = 10;
let dp = sd.Grid(svg).n(n+1).m(m+1).drag(true).resizeable(true);
for (let i = 1; i <= n; i++) {
    coin.push(makeItem(coin, data[i]));
}
sd.EnableGridArrow(dp);

main();

async function main() {
    dp.value(0, 0, sd.Text(dp, "0"));
    for (let j = 1; j <= m; j++)
        dp.value(0, j, sd.Text(dp, "-inf"));

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            let t1 = dp.value(i-1, j).text();
            if (j - data[i] >= 0) {
                let t2 = dp.value(i-1, j-data[i]).text();
                let tm = getMax(t1, t2);
                dp.value(i, j, tm);
                dp.makeArrow(dp, )
            } else {
                dp.value(i, j, tm);
            }
        }
    }
}

function getMax(s1, s2) {
    if (s1 === "-inf") return s2;
    if (s2 === "-inf") return s1;
    return Math.max(+s1, +s2);
}

function makeItem(svg, size) {
    let item = sd.Array(svg).resize(size);
    sd.EnableArrayName(item, `size=${size}`);
    return item;
}