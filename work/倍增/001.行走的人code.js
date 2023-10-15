import * as sd from "#lib/slide";

let source = `
int num[N][20];
int cur=1,ans;
for(int i=4;i>=0;i--){
    if(cur+(1<<i)<=n){
        ans+=num[cur][i];
        cur+=(1<<i);
    }
}`;
let lines = {
    define: [1, 2],
    for: [3],
    check: [4],
    move: [5, 6]
};

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).start(1).x(100).y(300);
let val = [0, 4, 3, 6, 3, 1, 2, 7, 9, 5, 9, 3, 2];
let people = sd.Circle(svg).r(15).color(C.GREEN);
let code = sd.Code(svg).code(source).x(50).y(50).drag(true);
let n = val.length - 1;
for (let i = 1; i <= n; i++)
    arr.push(val[i]);
arr.resize(18);
sd.EnableArrayName(arr, "散落的糖果");
people.drag(true).resizeable(true);
movePeople(1);

main();

function movePeople(at) {
    people.cx(arr.element(at).cx());
    people.my(arr.element(at).y() - 10);
}

async function main() {
    movePeople(1);
    await sd.pause();
    code.startAnimate().highlight(lines.define).endAnimate();

    let cur = 1;
    for (let i = 4; i >= 0; i--) {
        await sd.pause();
        code.startAnimate().highlight(lines.for).endAnimate();
        let to = (1<<i) + cur;
        await sd.pause();
        code.startAnimate().highlight(lines.check).endAnimate();
        await sd.pause();
        let cln = sd.Circle(arr).r(people.r()).x(people.x()).y(people.y()).color(people.color());
        cln.startAnimate().x(cln.x() + (1<<i) * arr.elementWidth()).color(C.BLUE).endAnimate();
        if (to <= n) {
            await sd.pause();
            code.startAnimate().highlight(lines.move).endAnimate();
            await sd.pause();
            people.startAnimate();
            movePeople(to);
            people.endAnimate();
            cln.after(people).remove();
            cur = to;
        } else {
            await sd.pause();
            cln.startAnimate().opacity(0).endAnimate().remove();
        }
    }
}