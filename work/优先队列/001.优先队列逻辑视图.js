import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let q = sd.Array(svg).x(280).y(200).drag(true).resizeable(true);
let code = sd.Code(svg).x(730).y(50).fontSize(25).drag(true).resizeable(true);
code.code(`
priority_queue<int> q;
q.push(5);
q.push(2);
q.push(6);
q.push(3);
int a=q.top();
q.pop();
int b=q.top();
q.pop();
`)

main();

async function main() {
    await sd.pause();
    code.startAnimate();
    code.highlight(1);
    code.endAnimate();

    await sd.pause();
    code.startAnimate();
    code.highlight(2);
    code.endAnimate();
    await sd.pause();
    push(5);

    await sd.pause();
    code.startAnimate();
    code.highlight(3);
    code.endAnimate();
    await sd.pause();
    push(2);

    await sd.pause();
    code.startAnimate();
    code.highlight(4);
    code.endAnimate();
    await sd.pause();
    push(6);
    
    await sd.pause();
    code.startAnimate();
    code.highlight(5);
    code.endAnimate();
    await sd.pause();
    push(3);

    await sd.pause();
    code.startAnimate().highlight(6).endAnimate();
    await sd.pause();
    q.startAnimate().color(0, C.red).endAnimate();
    
    await sd.pause();
    code.startAnimate().highlight(7).endAnimate();
    await sd.pause();
    pop();

    await sd.pause();
    code.startAnimate().highlight(8).endAnimate();
    await sd.pause();
    q.startAnimate().color(0, C.red).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(9).endAnimate();
    await sd.pause();
    pop();
}

function push(x) {
    q.startAnimate();
    let i = 0, flag = false;
    for (; i < q.length(); i++) {
        if (+q.value(i).text() < x) {
            q.insert(i, x);
            flag = true;
            break;
        }
    }
    if (!flag) q.push(x);
    q.endAnimate();
}

function pop() {
    q.startAnimate();
    q.erase(0);
    q.endAnimate();
}