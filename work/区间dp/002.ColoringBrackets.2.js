import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let status = sd.Code(svg)
status.x(100).y(50);
status.code("dp[l][r][cl][cr]表示，[l,r]这段区间，区间最左边的括号被\n染色成cl，区间最右边的括号被染色成cr，的染色方案总数");
status.fontSize(30);
let cols = [C.red, C.blue, C.white]
let opas = [0.5, 0.5, 0];

main();

function trace(rct, elem) {
    rct.x(elem.x()).width(elem.width());
    rct.y(elem.y()).height(elem.height());
}

async function main() {
    await sd.pause();
    let t1 = sd.Latex(svg);
    let m1 = sd.Mathjax(svg).math("l+1=r");
    t1.x(500).y(200).drag(true);
    m1.x(100).y(200);
    await sd.pause();
    t1.startAnimate().push("(").push(")").endAnimate();
    await sd.pause();
    let r11 = sd.Rect(svg).fillOpacity(0);
    trace(r11, t1.element(0));
    let r12 = sd.Rect(svg).fillOpacity(0);
    trace(r12, t1.element(1));
    for (let i = 0; i <= 2; i++)
        for (let j = 0; j <= 2; j++) {
            await sd.pause();
            r11.startAnimate().color(cols[i]).fillOpacity(opas[i]).endAnimate();
            r12.startAnimate().color(cols[j]).fillOpacity(opas[j]).endAnimate();
        }

    await sd.pause();
    let t2 = sd.Latex(svg);
    let m2 = sd.Mathjax(svg).math("match[l]=r");
    m2.x(100).y(280);
    t2.x(500).y(280);
    await sd.pause();
    t2.push("(");
    t2.startAnimate();
    t2.push(".");
    t2.push(".")
    t2.push(".")
    t2.endAnimate();
    t2.startAnimate();
    t2.push(")");
    t2.endAnimate();
    await sd.pause();
    let r2innerL = sd.Rect(svg).fillOpacity(0);
    trace(r2innerL, t2.element(1));
    let r2innerR = sd.Rect(svg).fillOpacity(0);
    trace(r2innerR, t2.element(3));
    let r2outerL = sd.Rect(svg).fillOpacity(0);
    trace(r2outerL, t2.element(0));
    let r2outerR = sd.Rect(svg).fillOpacity(0);
    trace(r2outerR, t2.element(4));
    for (let i = 0; i <= 2; i++)
        for (let j = 0; j <= 2; j++)
            for (let x = 0; x <= 2; x++)
                for (let y = 0; y <= 2; y++) {
                    await sd.pause();
                    r2innerL.startAnimate().color(cols[i]).fillOpacity(opas[i]).endAnimate();
                    r2innerR.startAnimate().color(cols[j]).fillOpacity(opas[j]).endAnimate();
                    r2outerL.startAnimate().color(cols[x]).fillOpacity(opas[x]).endAnimate();
                    r2outerR.startAnimate().color(cols[y]).fillOpacity(opas[y]).endAnimate();
                }

    await sd.pause();
    let t3 = sd.Latex(svg);
    let m3 = sd.Mathjax(svg).math("match[l]\\lt r");
    m3.x(100).y(360);
    t3.x(500).y(360);
    await sd.pause();
    t3.push("(");
    t3.startAnimate();
    t3.push("...");
    t3.endAnimate();
    t3.startAnimate();
    t3.push(")");
    t3.endAnimate();
    t3.startAnimate();
    t3.push("(");
    t3.endAnimate();
    t3.startAnimate();
    t3.push("...");
    t3.endAnimate();
    t3.startAnimate();
    t3.push(")");
    t3.endAnimate();
    t3.startAnimate();
    t3.push("(");
    t3.endAnimate();
    t3.startAnimate();
    t3.push("...");
    t3.endAnimate();
    t3.startAnimate();
    t3.push(")");
    t3.endAnimate();
    await sd.pause();
    let r3leftL = sd.Rect(svg).fillOpacity(0);
    trace(r3leftL, t3.element(0));
    let r3leftR = sd.Rect(svg).fillOpacity(0);
    trace(r3leftR, t3.element(2));
    let r3rightL = sd.Rect(svg).fillOpacity(0);
    trace(r3rightL, t3.element(3));
    let r3rightR = sd.Rect(svg).fillOpacity(0);
    trace(r3rightR, t3.element(8));
    for (let i = 0; i <= 2; i++)
        for (let j = 0; j <= 2; j++)
            for (let x = 0; x <= 2; x++)
                for (let y = 0; y <= 2; y++) {
                    await sd.pause();
                    r3leftL.startAnimate().color(cols[i]).fillOpacity(opas[i]).endAnimate();
                    r3leftR.startAnimate().color(cols[j]).fillOpacity(opas[j]).endAnimate();
                    r3rightL.startAnimate().color(cols[x]).fillOpacity(opas[x]).endAnimate();
                    r3rightR.startAnimate().color(cols[y]).fillOpacity(opas[y]).endAnimate();
                }
}