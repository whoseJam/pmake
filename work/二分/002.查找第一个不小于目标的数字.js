import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let data = [0, 1, 3, 4, 6, 8, 9, 9, 14, 16, 18, 19, 20];
let n = data.length - 1;
let target = 11;
let arr = sd.Array(svg).x(370).y(170).start(1).drag(true).resizeable(true);
let tTarget = sd.Text(svg, `target=${target}`).fontSize(40).x(370).y(70).drag(true).resizeable(true);

for (let i = 1; i <= n; i++)
    arr.push(data[i]);
sd.EnableArrayIndex(arr);
sd.EnableArrayPointer(arr);
sd.EnableArrayName(arr, "A数组");

main();
async function main() {
    await sd.pause();
    arr.makePointer("l", 0).movePointer("l", 1);
    arr.makePointer("r", 2).movePointer("r", n);
    
    while (arr.wherePointer("l") <= arr.wherePointer("r")) {
        let mid = Math.floor((arr.wherePointer("l") + arr.wherePointer("r")) / 2);
        await sd.pause();
        arr.makePointer("mid", 1);
        if (mid === arr.wherePointer("l")) arr.pointer("mid").length = 60;
        arr.movePointer("mid", mid);
        arr.pointer("mid").opacity(0);
        arr.startAnimate();
        arr.pointer("mid").opacity(1);
        arr.endAnimate();

        if (+arr.value(mid).text() < target) {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("l", mid + 1);
            arr.endAnimate();
        } else {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("r", mid - 1);
            arr.endAnimate();
        }
        await sd.pause();
        let p = arr.pointer("mid");
        p.startAnimate().opacity(0).endAnimate();
        arr.after(p).removePointer("mid");
    }
}