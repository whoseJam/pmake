import * as sd from "#lib/slide";

let preSource = `
int a[N];
int mx[N][20];
for(int i=1;i<=n;i++)
    mx[i][0]=a[i];
for(int j=1;j<=18;j++)
    for(int i=1;i+(1<<j-1)<=n;i++)
        mx[i][j]=max(mx[i][j-1],mx[i+(1<<j-1)][j-1]);`;

let querySource = `
int getMax(int l,int r){
    int k=log2(r-l+1);
    return max(mx[l][k],mx[r-(1<<k)+1][k]);
}`;

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).start(1).x(100).y(300);
let val = [0, 4, 3, 6, 3, 1, 2, 7, 9, 5, 9, 3, 2];
let n = val.length - 1;
for (let i = 1; i <= n; i++)
    arr.push(val[i]);
let preCode = sd.Code(svg).code(preSource);
let queryCode = sd.Code(svg).code(querySource);
preCode.x(100).y(100);
queryCode.x(700).y(100);
sd.EnableArrayName(arr.x(100).y(500), "原数组");
let txt = sd.Text(svg).x(700).y(500).fontSize(30);

main();

async function main() {
    while(true) {
        await sd.pause();
        let l = sd.rand(1, n);
        let r = sd.rand(1, n);
        if (l > r) { let tmp = l; l = r; r = tmp; }
        txt.text(`l=${l} r=${r}`);

        await sd.pause();
        arr.startAnimate();
        for (let i = l; i <= r; i++)
            arr.color(i, C.blue);
        arr.endAnimate();

        for (let j = 1; j <= 3; j++) {
            await sd.pause();
            queryCode.startAnimate();
            queryCode.highlight(j);
            queryCode.endAnimate();
        }

        await sd.pause();
        arr.startAnimate();
        for (let i = l; i <= r; i++)
            arr.color(i, C.white);
        arr.endAnimate();
    }
}