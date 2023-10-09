import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let top = 0;
let tTop = sd.Latex(svg).x(200).y(340).fontSize(50).push("top").push("=").push("?").drag(true).resizeable(true);
let stk = sd.Array(svg).x(200).y(240).drag(true).resizeable(true);
// let str = "2*(x+y)/(1-x)@";
// let str = "(25+x)*(a*(a+b+b)@";
let str = "(1+2*(3+4)/5)+6)*7)@"
let strArr = sd.Array(svg).x(200).y(140).drag(true).resizeable(true);
for (let i = 0; i < str.length; i++)
    strArr.push(str[i]);

sd.EnableArrayName(strArr, "字符串数组");
sd.EnableArrayName(stk, "逻辑视图");
sd.EnableArrayName(tTop, "物理视图");

main();

async function main() {
    for (let i = 0; i < str.length; i++) {
        await sd.pause();
        strArr.startAnimate();
        if (i > 0) strArr.color(i - 1, C.white);
        strArr.color(i, C.red);
        strArr.endAnimate();

        if (str[i] === "(") {
            await sd.pause();
            stk.startAnimate();
            stk.push(str[i]);
            stk.endAnimate();
            tTop.startAnimate();
            tTop.replace(2, "push", [++top]);
            tTop.endAnimate();
        } else if (str[i] === ")") {
            await sd.pause();
            tTop.startAnimate();
            tTop.replace(2, "push", [--top]);
            tTop.endAnimate();
            stk.startAnimate();
            stk.push(str[i]);
            stk.endAnimate();
            stk.startAnimate();
            if (stk.length() >= 2) {
                stk.pop();
                stk.pop();
            } else throw new Error;
            stk.endAnimate();
        }
    }
}