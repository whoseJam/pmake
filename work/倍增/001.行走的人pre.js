import * as sd from "#lib/slide";

let source = `
int a[N];
int num[N][20];
for(int i=1;i<=n;i++)
    num[i][0]=a[i];
for(int j=1;j<=4;j++)
    for(int i=1;i+(1<<j-1)<=n;i++)
        num[i][j]=num[i][j-1]+num[i+(1<<j-1)][j-1];`;
let lines = {
    define: [1, 2],
    init: [3, 4],
    prepare: [5, 7]
};

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).start(1).x(100).y(300);
let val = [0, 4, 3, 6, 3, 1, 2, 7, 9, 5, 9, 3, 2];
let code = sd.Code(svg).code(source).x(50).y(50).drag(true);
let n = val.length - 1;
for (let i = 1; i <= n; i++)
    arr.push(val[i]);
arr.resize(18);
sd.EnableArrayName(arr, "散落的糖果");

main();

async function main() {
    await sd.pause();
    code.startAnimate().highlight(lines.define).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(lines.prepare).endAnimate();
    for (let i = 1; i <= 4; i++) {
        await sd.pause();
        arr.startAnimate();
        for (let j = 1; j <= (1<<i); j++)
            arr.color(j, C.blue);
        arr.endAnimate();

        await sd.pause();
        arr.startAnimate();
        for (let j = 1; j <= (1<<i-1); j++)
            arr.color(j, C.green);
        arr.endAnimate();

        await sd.pause();
        arr.startAnimate();
        for (let j = 1; j <= (1<<i-1); j++)
            arr.color(j + (1<<i-1), C.orange);
        arr.endAnimate();
    }
}