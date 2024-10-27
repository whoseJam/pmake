import * as sd from "@/sd";

const svg = sd.svg();
const T = 300;

sd.main(async () => {
    await Test1();
    await Test2();
    await Test3();
    await Test4();
    await Test5();
    await Test6();
})

async function Test6() {
    await sd.pause();
    const n = 15;
    const maths = [];
    for (let i = 1; i <= n; i++) {
        maths.push(new sd.Mathjax(svg).math(`\\frac{{${i}}}{{${n}}}`).cx(500 + i * 40).y(300));
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const gcd = getGCD(i, n);
        maths[i - 1].startAnimate(T).replaceMath(`\\frac{{${i/gcd}}}{{${n/gcd}}}`, {1:1,2:2}).cx(500 + i * 40).endAnimate();
    }
}

async function Test5() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^{10}{i}").x(500).y(200);
    await sd.pause();
    math.startAnimate(T).replaceMath("{1+2+3+4+5+6+7+8+9+10}", {3:1}).endAnimate();
}

async function Test4() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\frac{{a}}{{b}}={c}").fontSize(40).x(500).y(100);
    await sd.pause();
    math.startAnimate(T).replaceMath("{a}={b}{c}", {1:1,2:2,3:3}).endAnimate();
}

async function Test3() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "{a^2}{+}{b^2}{=}{c^2}").fontSize(40).x(100).y(300);
    await sd.pause();
    math.startAnimate(T).replaceMath("{a^2}{=}{c^2}{-}{b^2}", {1:1,2:4,3:5,4:2,5:3}).endAnimate();
}

async function Test2() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "a^2+b^2=c^2").fontSize(40).x(100).y(200);
    await sd.pause();
    math.startAnimate(T).replaceMath("a^2=c^2-b^2").endAnimate();
}

async function Test1() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "{aaaa}{b}{c}{dddd}").fontSize(40).x(100).y(100);
    await sd.pause();
    math.startAnimate(T).replaceMath("{a}{c}{b}{d}", {1:1,2:3,3:2,4:4}).endAnimate();
}

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}