import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const T = 500;

sd.main(Test10);

async function Test0() {
    const math = new sd.Mathjax(svg, "").x(100).y(100);
    await sd.pause();
    math.startAnimate().transformMath("1234").endAnimate();
}

async function Test10() {
    const math = new sd.Mathjax(svg, "({x_i},{y_i})\\sum_{i=1}^{n}{(a+b)^{2}}").x(100).y(100);
    const m1 = math.createMath(5);
    const rect = sd.Focus(svg).focus(m1);
    await sd.pause();
    m1.startAnimate().dy(100).endAnimate();
    await sd.pause();
    m1.startAnimate().dy(100).endAnimate();
}

async function Test9() {
    const math = new sd.Mathjax(svg, "({x_i},{y_i})").cx(100).cy(100);
    await sd.pause();
    math.startAnimate(T).transformMath("({1},{3})", { 1: 1, 2: 2 }).endAnimate();
    await sd.pause();
    const m1 = math.createMath(1);
    const m3 = math.createMath(2);
    const sum = new sd.Mathjax(svg, "").cx(100).cy(200);
    sum.startAnimate(T).transformMathFrom("\\sum_{i={1}}^{3}i", [m1, m3], { 1: 2, 2: 3 }).endAnimate();
    await sd.pause();
    sum.startAnimate(T).transformMath("{1}+{2}+{3}").endAnimate();
    await sd.pause();
    const s1 = sum.createMath(1);
    const s2 = sum.createMath(2);
    const s3 = sum.createMath(3);
    const two = new sd.Mathjax(svg, "a+b+c").opacity(0).cx(200).cy(150).startAnimate().opacity(1);
    two.startAnimate(T).transformMathFrom("a^{1}+b^{2}+c^{3}", [s1, s2, s3], { 1: 1, 2: 2, 3: 3 }).endAnimate();
    await sd.pause();
    two.startAnimate(T).transformMath("a^{3}+b^{1}+c^{2}", { 1: 2, 2: 3, 3: 1 }).endAnimate();
    await sd.pause();
    two.startAnimate(T).transformMath("c^3+a^1+b^2").endAnimate();
    await sd.pause();
    two.startAnimate(T).transformMath("\\mu").fontSize(25).endAnimate();
    await sd.pause();
    sum.startAnimate(T).transformMath("\\varphi").fontSize(25).endAnimate();
    await sd.pause();
    math.startAnimate().transformMath("\\sigma").fontSize(25).endAnimate();
    await sd.pause();
    const final = new sd.Mathjax(svg, "").cx(125).cy(125).startAnimate(T).transformMathFrom("{\\infty}", [two, sum, math], { 1: 1, 2: 1, 3: 1 }).endAnimate();
}

async function Test8() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\frac{15}{20}").cx(300).cy(400);
    await sd.pause();
    math.startAnimate(10000).transformMath("\\frac{3}{4}").cx(300).cy(400).endAnimate();
}

async function Test7() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^{n}{(a+b)^2}").x(500).y(400);
    await sd.pause();
    math.element(1).startAnimate().color(C.textBlue).endAnimate();
    math.element(2).startAnimate().color(C.red).endAnimate();
    math.element(3).startAnimate().color(C.purple).endAnimate();
    await sd.pause();
    math.startAnimate().transformMath("{a+b}={c}").endAnimate();
    await sd.pause();
    const m1 = new sd.Mathjax(svg, "a").x(700).y(100);
    const m2 = new sd.Mathjax(svg, "b").x(800).y(100);
    const m3 = new sd.Mathjax(svg, "c").x(900).y(100);
    const m = new sd.Mathjax(svg, "ttt").x(800).y(200);
    await sd.pause();
    m.startAnimate(10000).transformMathFrom("\\sum_{i=1}^{n}{a+b}", [m1, m2, m3], { 1: 1, 2: 2, 3: 3 }).endAnimate();
}

async function Test6() {
    await sd.pause();
    const n = 15;
    const maths = [];
    for (let i = 1; i <= n; i++) {
        maths.push(
            new sd.Mathjax(svg)
                .math(`\\frac{{${i}}}{{${n}}}`)
                .cx(500 + i * 40)
                .y(300)
        );
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const gcd = getGCD(i, n);
        maths[i - 1]
            .startAnimate(T)
            .transformMath(`\\frac{{${i / gcd}}}{{${n / gcd}}}`, { 1: 1, 2: 2 })
            .cx(500 + i * 40)
            .endAnimate();
    }
}

async function Test5() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^{10}{i}").x(500).y(200);
    await sd.pause();
    math.startAnimate(T).transformMath("{1+2+3+4+5+6+7+8+9+10}", { 3: 1 }).endAnimate();
}

async function Test4() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "\\frac{{a}}{{b}}={c}").fontSize(40).x(500).y(100);
    await sd.pause();
    math.startAnimate(T).transformMath("{a}={b}{c}", { 1: 1, 2: 2, 3: 3 }).endAnimate();
}

async function Test3() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "{a^2}{+}{b^2}{=}{c^2}").fontSize(40).x(100).y(300);
    await sd.pause();
    math.startAnimate(T).transformMath("{a^2}{=}{c^2}{-}{b^2}", { 1: 1, 2: 4, 3: 5, 4: 2, 5: 3 }).endAnimate();
}

async function Test2() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "a^2+b^2=c^2").fontSize(40).x(100).y(200);
    await sd.pause();
    math.startAnimate(T).transformMath("a^2=c^2-b^2").endAnimate();
}

async function Test1() {
    await sd.pause();
    const math = new sd.Mathjax(svg, "{aaaa}{b}{c}{dddd}").fontSize(40).x(100).y(100);
    await sd.pause();
    math.startAnimate(T).transformMath("{a}{c}{b}{d}", { 1: 1, 2: 3, 3: 2, 4: 4 }).endAnimate();
}

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}
