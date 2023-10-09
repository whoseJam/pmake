import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let data = [0, 1, 3, 4, 6, 8, 9, 10, 14, 16, 18, 19, 20];
let n = data.length - 1;
let target = 18;
let arr = sd.Array(svg).x(370).y(170).start(1).drag(true).resizeable(true);
let code = sd.Code(svg).fontSize(25).x(390).y(270).drag(true).resizeable(true);
let tTarget = sd.Text(svg, `target=${target}`).fontSize(40).x(370).y(70).drag(true).resizeable(true);
code.code(`
int l=1,r=n;
while(l<=r){
    int mid=(l+r)/2;
    if(a[mid]==target){
        ans=mid;
        break;
    }
    if(a[mid]<target)l=mid+1;
    else r=mid-1;
}
`)
let codeLines = {
    init: [1],
    iterWhile: [2],
    countMid: [3],
    eqlTarget: [4],
    neqTarget: [8, 9],
    ltTarget: [8],
    gtTarget: [9]
};

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
    code.startAnimate();
    code.highlight.apply(code, codeLines.init);
    code.endAnimate();
    
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
        code.startAnimate();
        code.highlight.apply(code, codeLines.countMid);
        code.endAnimate();

        if (+arr.value(mid).text() === target) {
            await sd.pause();
            arr.startAnimate();
            arr.color(mid, C.green);
            arr.endAnimate();
            code.startAnimate();
            code.highlight.apply(code, codeLines.eqlTarget);
            code.endAnimate();
            break;
        }
        await sd.pause();
        code.startAnimate();
        code.highlight.apply(code, codeLines.neqTarget);
        code.endAnimate();

        if (+arr.value(mid).text() < target) {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("l", mid + 1);
            arr.endAnimate();
            code.startAnimate();
            code.highlight.apply(code, codeLines.ltTarget);
            code.endAnimate();
        } else if (+arr.value(mid).text() > target) {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("r", mid - 1);
            arr.endAnimate();
            code.startAnimate();
            code.highlight.apply(code, codeLines.gtTarget);
            code.endAnimate();
        }
        await sd.pause();
        let p = arr.pointer("mid");
        p.startAnimate().opacity(0).endAnimate();
        arr.after(p).removePointer("mid");
    }
}