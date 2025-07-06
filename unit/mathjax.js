import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const T = 500;

sd.main(TestDigitFade);

async function TestDigitFade() {
    const math = new sd.Mathjax(svg, "123456");
    await sd.pause();
    math.startAnimate().text("12345", { 12345: 12345 }).endAnimate();
    await sd.pause();
    math.startAnimate().text("1234", { 1234: 1234 }).endAnimate();
    await sd.pause();
    math.startAnimate().text("123", { 123: 123 }).endAnimate();
}

async function TestDigitSplit() {
    const math = new sd.Mathjax(svg, "a^{123456}").x(100).y(100).fontSize(50);
    await sd.pause();
    math.subtextColor("345", C.red);
}

async function TestInstantSwitch() {
    const math = new sd.Mathjax(svg, "1").x(100).y(100).fontSize(50);
    await sd.pause();
    math.text("?");
}

async function TestFibnacci() {
    const fn1 = new sd.Mathjax(svg, "f_{n-1}").x(100).y(100).fontSize(40);
    const fn2 = new sd.Mathjax(svg, "f_{n-2}").x(100).y(200).fontSize(40);
    await sd.pause();
    const sum = new sd.Mathjax(svg)
        .x(500)
        .y(100)
        .fontSize(60)
        .startAnimate()
        .text("f_{n-1}+f_{n-2}", [
            [fn1, "f_{n-1}"],
            [fn2, "f_{n-2}"],
        ])
        .endAnimate();
}

async function TestColorCover() {
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^n(a+b)^2").x(100).y(100).fontSize(50);
    await sd.pause();
    math.startAnimate().subtextColor("a+b", C.orange).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("i=1", C.grey).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("(a+b)^2", C.textBlue).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("2", C.red).endAnimate();
}

async function Test11() {
    const m1 = new sd.Mathjax(svg, "1").x(100).y(100).color(C.textBlue).fontSize(50);
    const m2 = new sd.Mathjax(svg, "2").x(100).y(200).fontSize(50);
    const m3 = new sd.Mathjax(svg, "3").x(200).y(100).fontSize(50);
    const m4 = new sd.Mathjax(svg, "4").x(200).y(200).fontSize(50);
    await sd.pause();
    const math = new sd.Mathjax(svg)
        .x(400)
        .y(100)
        .startAnimate()
        .text("1+2+3+4", [
            [m1, "1", "1"],
            [m2, "2"],
            [m3, "3"],
            [m4, "4"],
        ])
        .endAnimate();
}

async function Test10() {
    const data = [
        ["?", "?"],
        ["?", "?"],
    ];
    function matrix(data) {
        let ans = "\\begin{pmatrix}";
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                ans += String(data[i][j]);
                if (j !== data[i].length - 1) ans += " &";
                else ans += "\\\\";
            }
        }
        ans += "\\end{pmatrix}";
        return ans;
    }
    const math = new sd.Mathjax(svg, matrix(data)).x(100).y(100);
    const value = new sd.Mathjax(svg, "8").x(100).y(300);
    await sd.pause();
    data[0][0] = 8;
    math.startAnimate()
        .text(matrix(data), [[value, "8"]])
        .endAnimate();
}

async function Test9() {
    const math = new sd.Mathjax(svg, "(x_i,y_i)").cx(100).cy(100);
    await sd.pause();
    math.startAnimate(T).text("(1,3)", { x_i: 1, y_i: 3 }).endAnimate();
    await sd.pause();
    const sum = new sd.Mathjax(svg).cx(100).cy(200);
    sum.startAnimate(T)
        .text("\\sum_{i=1}^3 i", [
            [math, "1", "1"],
            [math, "3", "3"],
        ])
        .endAnimate();
    await sd.pause();
    sum.startAnimate(T).text("1+2+3").endAnimate();
    await sd.pause();
    const two = new sd.Mathjax(svg, "a+b+c").opacity(0).cx(200).cy(150).startAnimate().opacity(1);
    await sd.pause();
    two.startAnimate(T)
        .text("a^1+b^2+c^3", [
            [sum, "1", "1"],
            [sum, "2", "2"],
            [sum, "3", "3"],
        ])
        .endAnimate();
    await sd.pause();
    two.startAnimate(T).text("a^3+b^1+c^2", { 1: 1, 2: 2, 3: 3 }).endAnimate();
    await sd.pause();
    two.startAnimate(T).text("c^3+a^1+b^2").endAnimate();
    await sd.pause();
    two.startAnimate(T).text("\\mu").fontSize(40).endAnimate();
    await sd.pause();
    sum.startAnimate(T).text("\\varphi").fontSize(40).endAnimate();
    await sd.pause();
    math.startAnimate().text("\\sigma").fontSize(40).endAnimate();
    // await sd.pause();
    // const final = new sd.Mathjax(svg)
    //     .cx(125)
    //     .cy(125)
    //     .startAnimate(T)
    //     .text("{\\infty}", [
    //         [two, "\\infty"],
    //         [sum, "\\infty"],
    //         [math, "\\infty"],
    //     ])
    //     .endAnimate();
}

async function Test8() {
    const m1 = new sd.Mathjax(svg, "a").x(700).y(100);
    const m2 = new sd.Mathjax(svg, "b").x(800).y(100);
    const m3 = new sd.Mathjax(svg, "c").x(900).y(100);
    const m = new sd.Mathjax(svg, "ttt").x(800).y(200);
    await sd.pause();
    m.startAnimate(T)
        .text("\\sum_{i=1}^{n}{a+b}", [
            [m1, "i=1"],
            [m2, "n"],
            [m3, "a+b"],
        ])
        .fontSize(50)
        .x(100)
        .subtextColor("a+b", C.textBlue)
        .endAnimate();
}

async function Test7() {
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^n(a+b)^2").fontSize(50).x(100).y(100);
    await sd.pause();
    math.startAnimate();
    math.subtextColor("i=1", C.textBlue);
    math.subtextColor("n", C.red);
    math.subtextColor("(a+b)^2", C.purple);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.text("{a+b}={c}", { "a+b": "a+b" });
    math.subtextColor("a+b", C.purple);
    math.endAnimate();
}

async function Test6() {
    const n = 15;
    const maths = [];
    for (let i = 1; i <= n; i++) {
        maths.push(
            new sd.Mathjax(svg)
                .text(`\\frac{${i}}{${n}}`)
                .cx(500 + i * 40)
                .y(300)
        );
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const gcd = getGCD(i, n);
        const mapping = [
            [i, i / gcd],
            [n, n / gcd],
        ];
        maths[i - 1]
            .startAnimate(T)
            .text(`\\frac{${i / gcd}}{${n / gcd}}`, mapping)
            .cx(500 + i * 40)
            .endAnimate();
    }
}

async function Test5() {
    const math = new sd.Mathjax(svg, "\\sum_{i=1}^{10}{i}").x(500).y(200);
    await sd.pause();
    math.startAnimate(T).text("1+2+3+4+5+6+7+8+9+10", { "i=1": "1+2+3+4+5+6+7+8+9+10" }).endAnimate();
}

async function Test4() {
    const math = new sd.Mathjax(svg, "\\frac a b=c").fontSize(40).x(500).y(100);
    await sd.pause();
    math.startAnimate(T).text("a=bc", { a: "a", b: "b", c: "c" }).endAnimate();
}

async function Test3() {
    const math = new sd.Mathjax(svg, "a^2+b^2=c^2").fontSize(40).x(100).y(300);
    await sd.pause();
    math.startAnimate(T).text("a^2=c^2-b^2", { "a^2": "a^2", "b^2": "b^2", "c^2": "c^2", "=": "=" }).endAnimate();
}

async function Test2() {
    const math = new sd.Mathjax(svg, "a^2+b^2=c^2").fontSize(180).x(100).y(200);
    const rect = new sd.Rect(svg).fillOpacity(0).x(math.x()).y(math.y()).width(math.width()).height(math.height());
    await sd.pause();
    math.startAnimate(T).text("a^2=c^2-b^2").endAnimate();
}

async function Test1() {
    const math = new sd.Mathjax(svg, "a^2b^2c^2d^2").x(100).y(100).fontSize(100);
    const mx = math.mx();
    await sd.pause();
    math.startAnimate().subtextColorAll("b^2", C.red).endAnimate();
    await sd.pause();
    math.startAnimate().color(C.textBlue).subtextColorAll("a^2", C.orange).fontSize(50).mx(mx).subtextColorLast("2", C.pureBlue).endAnimate();
    await sd.pause();
    math.startAnimate().text("2a").color(C.textBlue).endAnimate();
    await sd.pause();
    math.startAnimate().text("3q").fontSize(180).endAnimate();
}

async function Test0() {
    const math = new sd.Mathjax(svg, "").x(100).y(100);
    await sd.pause();
    math.startAnimate().text("1234").fontSize(40).endAnimate();
    await sd.pause();
    math.startAnimate().text("5678").fontSize(20).endAnimate();
    await sd.pause();
    math.startAnimate().text("1234").color(C.textBlue).fontSize(40).endAnimate();
    await sd.pause();
    math.startAnimate().color(C.purple).endAnimate();
}

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}
