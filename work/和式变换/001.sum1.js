import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let mathX = 100, codeX = 700, y = 50;

let code1 = `
for(int i=1;i<=n;i++)
    ans+=a[i];
return ans;`;
let code2 = `
for(int i=1;i<=n;i++)
    ans+=a[i]*k;
return ans;`;
let code3 = `
for(int i=1;i<=n;i++)
    ans+=a[i];
ans*=k;
reeturn ans;`;
let codeA = `
for(int i=1;i<=n;i++)
    for(int j=1;j<=m;j++)
        ans+=a[i]*b[j];
return ans;`;
let codeB = `
for(int i=1;i<=n;i++)sum1+=a[i];
for(int i=1;i<=m;i++)sum2+=b[i];
return sum1*sum2;
`

main();

async function main() {
    await makeMath(`\\sum_{i=1}^n a[i]`, code1);
    await makeMath(`\\sum_{i=1}^n a_i\\cdot k`, code2);
    await makeMath(`k\\cdot \\sum_{i=1}^n a_i`, code3);
    await sd.pause();
    let c = sd.Code(svg);
    c.x(500).y(y).opacity(0).code(codeA);
    c.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let math = sd.Mathjax(svg);
    math.x(mathX).y(y).height(50).math(`\\sum_{i=1}^n \\sum_{j=1}^m a_i\\cdot b_j`);
    await sd.pause();
    math.startAnimate();
    math.x(mathX).y(y).height(50).math(`\\sum_{i=1}^n a_i \\sum_{j=1}^m b_j`);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.x(mathX).y(y).height(50).math(`(\\sum_{i=1}^n a_i)\\cdot (\\sum_{j=1}^m b_j)`);
    math.endAnimate();
    await sd.pause();
    c.startAnimate().opacity(0).endAnimate();
    c.code(codeB);
    c.startAnimate().opacity(1).endAnimate();
}

async function makeMath(str, source, height = 50) {
    await sd.pause();
    let math = sd.Mathjax(svg);
    math.x(mathX).y(y).height(height);
    math.math(str);

    await sd.pause();
    let code = sd.Code(svg).fontSize(15);
    code.code(source);
    code.opacity(0).x(codeX).cy(math.cy());
    let ar = sd.Line(svg);
    ar.x1(math.mx() + 10).y1(math.cy());
    ar.x2(code.x() - 10).y2(math.cy());
    ar.strokeDashArray("0 87.5%");
    ar.startAnimate();
    ar.strokeDashArray("100% 0%");
    ar.endAnimate();
    ar.markerEnd("arrow");
    code.after(ar);
    code.startAnimate().opacity(1).endAnimate();
    y += math.height() + 50;
    return math;
}