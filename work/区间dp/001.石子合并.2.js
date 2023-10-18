import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 5;
let dp = sd.Grid(svg).n(n+1).m(n+1);
dp.x(100).y(100).drag(true).resizeable(true);
let m1 = sd.Mathjax(svg).height(80).x(500).y(100);
m1.math(`dp[i][j]=\\mathop{Min}_{k=i}^{j-1}(dp[i][k]+dp[k+1][j])`);

for (let i = 1; i <= n; i++) {
    dp.value(i, 0, sd.Text(svg, i));
    dp.value(0, i, sd.Text(svg, i));
}

main();

async function main() {
    await sd.pause();
    dp.startAnimate();
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            if (i > j) dp.color(i, j, C.grey);
    dp.endAnimate();

    for (let l = 1; l <= n; l++) {
        await sd.pause();
        dp.startAnimate();
        for (let i = 1; i + l - 1 <= n; i++) {
            let j = i + l - 1;
            dp.color(i, j, C.green);
        }
        dp.endAnimate();

        await sd.pause();
        dp.startAnimate();
        for (let i = 1; i + l - 1 <= n; i++) {
            let j = i + l - 1;
            dp.color(i, j, C.blue);
        }
        dp.endAnimate();
    }
}