import * as sd from "#lib/slide";

let svg = sd.svg();
let m1 = sd.Mathjax(svg).height(50).math(`a^b`).x(100).y(100);
let m2 = sd.Mathjax(svg).height(50).math("").x(100).y(160);
let m3 = sd.Mathjax(svg).height(50).math("").x(100).y(240);
let m4 = sd.Mathjax(svg).height(50).math("").x(100).y(300);
let T = 43;
let binT = sd.Array(svg).drag(true).x(370).y(370);
for (let i = 10; i >= 0; i--) {
    if (T & (1<<i)) binT.push(1);
    else binT.push(0);
}
sd.EnableFocusRect(binT);
sd.EnableArrayName(binT, "二进制表示");
binT.focus(10);
binT.opacity(0);

main();

async function main() {
    await sd.pause();
    m2.startAnimate();
    m2.math("a^0,\\ a^1,\\ a^2,\\ a^4,\\ a^8...")
    m2.endAnimate();
    await sd.pause();
    m3.startAnimate();
    m3.math(`ans=a^{${T}}`);
    m3.endAnimate();
    await sd.pause();
    binT.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let t = 0;
    m4.startAnimate();
    m4.math("ans=a^0");
    m4.endAnimate();
    for (let i = 0; i <= 10; i++) {
        await sd.pause();
        binT.startAnimate();
        binT.focus(10 - i);
        binT.endAnimate();
        if (T & (1<<i)) {
            await sd.pause();
            m4.startAnimate();
            m4.math(`ans=a^{${t}}\\cdot a^{${1<<i}}`);
            m4.endAnimate();
            await sd.pause();
            m4.startAnimate();
            t += (1<<i);
            m4.math(`ans=a^{${t}}`);
            m4.endAnimate();
        }
    }
}