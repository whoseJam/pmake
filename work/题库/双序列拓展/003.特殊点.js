import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let g = sd.Grid(svg);
let x = sd.Array(svg).start(1);
let y = sd.Stack(svg).start(1);
let proof = sd.Code(svg);
let n = 10, m = 10;
g.x(100).y(100).n(n).m(m).startN(1).startM(1);
for (let i = 1; i <= n; i++)
    x.push("?");
for (let i = 1; i <= m; i++)
    y.push("?");
x.x(g.x()).my(g.y());
y.mx(g.x()).y(g.y());
x.value(1, "X[1]");
y.value(1, "Y[1]");
proof.fontSize(30).x(600).y(60).code("X[1]<Y[1]");
proof.push("    ");
g.color(1, 1, C.green);

main();

async function main() {
    await sd.pause();
    x.startAnimate().value(3, "Xmin").color(3, C.blue).endAnimate();
    y.startAnimate().value(6, "Y[i]").color(6, C.blue).endAnimate();
    await sd.pause();
    proof.startAnimate()
    proof.push("假设Y[i]<=Xmin")
    proof.endAnimate();
    await sd.pause();
    proof.startAnimate();
    proof.push("则Y[i]<=任何一个X[i]");
    proof.endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= n; i++)
        g.color(6, i, C.grey);
    g.endAnimate();
    await sd.pause();
    proof.startAnimate();
    proof.push("如果能连通，Xmin<Y[i]应该恒成立")
    proof.endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= n; i++)
        g.color(6, i, C.white);
    g.endAnimate();
    x.startAnimate().value(3, "?").color(3, C.white).endAnimate();
    y.startAnimate().value(6, "?").color(6, C.white).endAnimate();
    await sd.pause();


    y.startAnimate().value(4, "Ymax").color(4, C.blue).endAnimate();
    x.startAnimate().value(6, "X[i]").color(6, C.blue).endAnimate();
    await sd.pause();
    proof.push("    ");
    proof.startAnimate();
    proof.push("假设X[i]>=Ymax")
    proof.endAnimate();
    await sd.pause();
    proof.startAnimate();
    proof.push("则X[i]>=任何一个Y[i]");
    proof.endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= m; i++)
        g.color(i, 6, C.grey);
    g.endAnimate();
    await sd.pause();
    proof.startAnimate();
    proof.push("如果能连通，Ymax>X[i]应该恒成立");
    proof.endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= m; i++)
        g.color(i, 6, C.white);
    g.endAnimate();
    y.startAnimate().value(4, "?").color(4, C.white).endAnimate();
    x.startAnimate().value(6, "?").color(6, C.white).endAnimate();

    await sd.pause();
    x.startAnimate().value(6, "Xmin").color(6, C.blue).endAnimate();
    y.startAnimate().value(4, "Ymax").color(4, C.blue).endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= n; i++)
        g.color(4, i, C.green);
    for (let i = 1; i <= m; i++)
        g.color(i, 6, C.green);
    g.endAnimate();
}

