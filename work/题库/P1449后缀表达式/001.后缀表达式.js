import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let exp = sd.Array(svg).x(420).y(130).start(1).drag(true).resizeable(true);
let stk = sd.Array(svg).x(420).y(230).start(1).drag(true).resizeable(true);
let data = [0, 3, 5, 2, "-", "*", 7, "+"];
let n = data.length - 1;
sd.EnableArrayName(exp, "表达式");
sd.EnableArrayName(stk, "计算栈");
for (let i = 1; i <= n; i++) exp.push(data[i]);

main();

async function main() {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        exp.startAnimate();
        if (i > 1) exp.color(i - 1, C.white);
        exp.color(i, C.red);
        exp.endAnimate();

        await sd.pause();
        stk.startAnimate();
        stk.push(data[i]);
        stk.endAnimate();
        if (typeof(data[i]) !== "number") {
            await sd.pause();
            stk.startAnimate();
            stk.color(stk.end(), C.orange);
            stk.color(stk.end() - 1, C.orange);
            stk.color(stk.end() - 2, C.orange);
            stk.endAnimate();
            await sd.pause();
            let vf = +stk.value(stk.end() - 2).text();
            let vb = +stk.value(stk.end() - 1).text();
            let ef = stk.value(stk.end() - 2);
            let eb = stk.value(stk.end() - 1);
            let eo = stk.value(stk.end());
            let count = sd.Latex(svg).x(540).y(350).drag(true).resizeable(true);
            let tf = sd.Text(count, ef.text()).cx(ef.cx()).cy(ef.cy()).fontSize(ef.fontSize());
            let tb = sd.Text(count, eb.text()).cx(eb.cx()).cy(eb.cy()).fontSize(eb.fontSize());
            let to = sd.Text(count, eo.text()).cx(eo.cx()).cy(eo.cy()).fontSize(eo.fontSize());
            count.preIn((elem) => {});
            count.in((elem) => {});
            tf.startAnimate(); tb.startAnimate(); to.startAnimate();
            count.push(tf).push(to).push(tb);
            tf.endAnimate(); tb.endAnimate(); to.endAnimate();
            await sd.pause();
            count.preIn((elem) => {});
            count.in((elem) => { elem.opacity(0).startAnimate(count).opacity(1); });
            count.startAnimate();
            count.push("=");
            count.push(compute(vf, data[i], vb));
            count.endAnimate();

            await sd.pause();
            stk.startAnimate();
            stk.pop();
            stk.pop();
            stk.pop();
            stk.endAnimate();
            await sd.pause();
            stk.startAnimate();
            stk.push(compute(vf, data[i], vb));
            stk.endAnimate();
            await sd.pause();
            count.startAnimate().opacity(0).endAnimate().remove();
        }
    }
}

function compute(a, op, b) {
    if (op === "+") return a + b;
    else if (op === "-") return a - b;
    else if (op === "*") return a * b;
    return a / b;
}