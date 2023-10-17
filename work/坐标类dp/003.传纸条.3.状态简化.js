import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let m1 = sd.Mathjax(svg).math("").x(100).y(100);
let m2 = sd.Mathjax(svg).math("").x(100).y(200);

main();

async function main() {
    await sd.pause();
    m1.startAnimate();
    m1.math(`dp[i][j][x][y]`);
    m1.endAnimate();
    await sd.pause();
    m1.startAnimate();
    m1.math(`dp[i][j][x][y]\\leftarrow dp[i-1][j][x-1][y]`);
    m1.endAnimate();
    await sd.pause();
    m1.startAnimate();
    m1.math(`dp[i][j][x][y]\\leftarrow dp[i][j-1][x-1][y]`);
    m1.endAnimate();
    await sd.pause();
    m1.startAnimate();
    m1.math(`dp[i][j][x][y]\\leftarrow dp[i-1][j][x][y-1]`);
    m1.endAnimate();
    await sd.pause();
    m1.startAnimate();
    m1.math(`dp[i][j][x][y]\\leftarrow dp[i][j-1][x][y-1]`);
    m1.endAnimate();
    await sd.pause();
    m2.startAnimate();
    m2.math(`dp[k][i][x]`);
    m2.endAnimate();
    await sd.pause();
    m2.startAnimate();
    m2.math(`dp[k][i][x]\\leftarrow dp[k-1][i-1][x-1]`);
    m2.endAnimate();
    await sd.pause();
    m2.startAnimate();
    m2.math(`dp[k][i][x]\\leftarrow dp[k-1][i][x-1]`);
    m2.endAnimate();
    await sd.pause();
    m2.startAnimate();
    m2.math(`dp[k][i][x]\\leftarrow dp[k-1][i-1][x]`);
    m2.endAnimate();
    await sd.pause();
    m2.startAnimate();
    m2.math(`dp[k][i][x]\\leftarrow dp[k-1][i][x]`);
    m2.endAnimate();
}