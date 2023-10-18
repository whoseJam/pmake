import * as sd from "#lib/slide";

let svg = sd.svg();
let m1 = sd.Mathjax(svg).math(`世界+状态\\rightarrow 精确描述`);
m1.x(100).y(100).height(50);

main();

async function main() {
    await sd.pause();
    let m2 = sd.Code(svg).code(`精确描述可以是方案总数的精确描述，可以是最优方案的精确描述...`);
    m2.x(100).y(200).fontSize(30).opacity(0);
    m2.startAnimate().opacity(1).endAnimate();
    
    await sd.pause();
    let m3 = sd.Code(svg).code(`dp[i]表示走到第i行，能取到的最大值`);
    m3.x(100).y(250).fontSize(30).opacity(0);
    m3.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    let m4 = sd.Code(svg).code(`发现状态不够用，再添加一个at[i]，表示走到第i行取到最大值时，所在的列标号`);
    m4.x(100).y(300).fontSize(30).opacity(0);
    m4.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    let m5 = sd.Code(svg).code(`dp[i][j]表示走到第i行，第j列，能取到的最大值`);
    m5.x(100).y(350).fontSize(30).opacity(0);
    m5.startAnimate().opacity(1).endAnimate();
}