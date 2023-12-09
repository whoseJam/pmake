import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).x(100).y(100);
sd.EnableArrayName(arr, "x", 15);
arr.indexed(true).opacity(0);
let code = sd.Code(svg).code(`
vector<int>x;
x.push_back(1);
x.push_back(5);
cout<<x[0]<<endl;
cout<<x[1]<<endl;
cout<<x[2]<<endl;
cout<<x.size()<<endl;
x.push_back(6);
x.pop_back();
x.pop_back();
`).x(700).y(100);

main();

async function main() {
    await sd.pause();
    code.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    arr.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    arr.startAnimate().push(1).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    arr.startAnimate().push(5).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(4).endAnimate();
    await sd.pause();
    arr.startAnimate().color(0, C.green).endAnimate();
    await sd.pause();
    arr.startAnimate().color(0, C.white).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(5).endAnimate();
    await sd.pause();
    arr.startAnimate().color(1, C.green).endAnimate();
    await sd.pause();
    arr.startAnimate().color(1, C.white).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(6).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(7).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(8).endAnimate();
    await sd.pause();
    arr.startAnimate().push(6).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(9).endAnimate();
    await sd.pause();
    arr.startAnimate().pop().endAnimate();

    await sd.pause();
    code.startAnimate().highlight(10).endAnimate();
    await sd.pause();
    arr.startAnimate().pop().endAnimate();
}