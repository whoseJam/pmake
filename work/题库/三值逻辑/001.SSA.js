import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let code = sd.Code(svg).fontSize(30).x(100).y(100);
code.code(`
r[2]=!r[1]
r[3]=!r[2]
r[1]=!r[3]
r[1]=T`)
let ans = sd.Code(svg).fontSize(30).x(400).y(100);
let table = sd.VarTable(svg).elementWidth(100).elementHeight(60);
table.x(800).y(100);

main();

async function main() {
    await sd.pause();
    ans.startAnimate();
    ans.push("T[1]=r[1]");
    ans.push("T[2]=r[2]");
    ans.push("T[3]=r[3]");
    ans.endAnimate();
    table.startAnimate();
    table.put("r[1]", "T[1]");
    table.put("r[2]", "T[2]");
    table.put("r[3]", "T[3]");
    table.endAnimate();
    await sd.pause();
    code.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    ans.startAnimate().push("T[4]=!T[1]").endAnimate();
    await sd.pause();
    table.startAnimate().color(2, 1, C.blue).endAnimate();
    table.startAnimate().put("r[2]", "T[4]").endAnimate();
    table.startAnimate().color(2, 1, C.white).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    ans.startAnimate().push("T[5]=!T[4]").endAnimate();
    await sd.pause();
    table.startAnimate().color(3, 1, C.blue).endAnimate();
    table.startAnimate().put("r[3]", "T[5]").endAnimate();
    table.startAnimate().color(3, 1, C.white).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    ans.startAnimate().push("T[6]=!T[5]").endAnimate();
    await sd.pause();
    table.startAnimate().color(1, 1, C.blue).endAnimate();
    table.startAnimate().put("r[1]", "T[6]").endAnimate();
    table.startAnimate().color(1, 1, C.white).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(4).endAnimate();
    await sd.pause();
    ans.startAnimate().push("T[7]=T").endAnimate();
    await sd.pause();
    table.startAnimate().color(1, 1, C.blue).endAnimate();
    table.startAnimate().put("r[1]", "T[7]").endAnimate();
    table.startAnimate().color(1, 1, C.white).endAnimate();
    await sd.pause();
    code.startAnimate().dehighlight().endAnimate();
    await sd.pause();
    table.startAnimate().x(100).y(300).endAnimate();
    await sd.pause();
    
    let g = sd.Graph(svg).x(800).y(100);
    for (let i = 1; i <= 7; i++)
        g.newNode(i, `T[${i}]`);
    g.newLink(1, 4, "1"); g.element(1, 4).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.newLink(4, 5, "1"); g.element(4, 5).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.newLink(5, 6, "1"); g.element(5, 6).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    g.startAnimate()
    g.newLink(1, 7, "0");
    g.element(1, 7).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.endAnimate();
    await sd.pause();
    g.startAnimate()
    g.newLink(2, 4, "0");
    g.element(2, 4).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.endAnimate();
    await sd.pause();
    g.startAnimate()
    g.newLink(3, 5, "0");
    g.element(3, 5).valueRule(R.PointAtPathByRate(0.5, "x", "cy"));
    g.endAnimate();
}