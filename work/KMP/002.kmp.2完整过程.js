import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).start(1).x(100).y(100);
let str = " babaababab";
let n = str.length - 1;
let len = sd.Array(svg).start(1).x(100).y(200).resize(10);
sd.EnableArrayName("len数组");

for (let i = 1; i <= n; i++) arr.push(str[i]);

main();

async function main() {
    let p = 0;
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        arr.startAnimate();
        if (i > 1) arr.color(i - 1, C.white);
        else len.startAnimate().value(1, sd.Text(len, 1)).endAnimate();
        arr.color(i, C.red);
        arr.endAnimate();

        if (i === 1) continue;
        
        await sd.pause();
        arr.startAnimate();
    }
}