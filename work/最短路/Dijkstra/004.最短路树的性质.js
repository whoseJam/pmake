import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let t = sd.Tree(svg).width(600).x(100).y(100).layerHeight(100);
for (let i = 1; i <= 12; i++)
    t.newNode(i, null);
t.newLink(1, 2);
t.newLink(2, 3);
t.newLink(2, 4);
t.newLink(3, 5);
t.newLink(4, 6);
t.newLink(4, 7);
t.newLink(5, 8);
t.newLink(5, 9);
t.newLink(5, 10);
t.newLink(6, 11);
t.newLink(6, 12);

main();

async function main() {
    await sd.pause();
    t.startAnimate();
    t.value(1, "S");
    t.endAnimate();
    await sd.pause();
    t.startAnimate();
    t.value(4, "X");
    t.value(11,"Y");
    t.endAnimate();
    await sd.pause();
    let code = sd.Code(svg).x(700).y(100);
    code.startAnimate();
    code.push("对于树上呈现祖先-后代关系的两个点X和Y");
    code.endAnimate();
    code.startAnimate();
    code.push("X和Y之间的最短路的长度");
    code.push("一定等于X和Y在最短路树上的距离")
    code.endAnimate();
    t.after(code).startAnimate();
    let l1 = t.element(4, 6); l1.stroke(C.red).strokeWidth(3);
    let l2 = t.element(6, 11); l2.stroke(C.red).strokeWidth(3);
    t.endAnimate();

    await sd.pause();
    let c1 = sd.Circle(svg);
    c1.x(800).y(300).stroke(C.red).strokeDashArray(5);
    let c2 = sd.Circle(svg);
    c2.x(800).y(400).stroke(C.red).strokeDashArray(5);
    let lk1 = sd.CurveLink(svg).bending(-0.25).from(t.element(4)).to(c1).strokeDashArray(5).stroke(C.red);
    let lk2 = sd.CurveLink(svg).bending(-0.25).from(c1).to(c2).strokeDashArray(5).stroke(C.red);
    let lk3 = sd.CurveLink(svg).bending(-0.5).from(c2).to(t.element(11)).strokeDashArray(5).stroke(C.red);
    let group = [c1, c2, lk1, lk2, lk3];
    for (let i = 0; i < group.length; i++)
        group[i].opacity(0).startAnimate().opacity(1).endAnimate();
}