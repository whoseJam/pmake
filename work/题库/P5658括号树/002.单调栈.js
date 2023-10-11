import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let str = "(()(()))()(()())";
let strArr = sd.Array(svg).x(100).y(100);
for (let i = 0; i < str.length; i++)
    strArr.push(str[i]);
let arr = sd.BarArray(svg).x(100).y(500);

main();

async function main() {
    let top = 1;
    for (let i = 0; i < str.length; i++) {
        await sd.pause();
        strArr.startAnimate().color(i, C.red).endAnimate();

        await sd.pause();
        if (str[i] === "(") top++;
        else top--;
        arr.startAnimate();
        arr.push(top);
        arr.element(arr.end()).top = top;
        arr.color(arr.end(), C.BLUE);
        arr.endAnimate();
        while (arr.end() >= 1 && arr.element(arr.end() - 1).top > top) {
            await sd.pause();
            arr.startAnimate();
            arr.erase(arr.end() - 1);
            arr.endAnimate();
        }

        await sd.pause();
        strArr.startAnimate().color(i, C.white).endAnimate();
    }
}