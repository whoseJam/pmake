import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let seq = [1, 4, 2, 5, 3, 1, 4, 7];
let top = 0;
let stk = make_stack()
    .x(600).y(500)
    .drag(true).resizeable(true)
    .start(1);
let arr = sd.Array(svg);
for (let i = 0; i < seq.length; i++)
    arr.push(seq[i]);
arr.x(100).y(100).drag(true).resizeable(true)
   .start(0);

main();

function make_stack() {
    let stk = sd.BarArray(svg)
    stk.push_ = stk.push;
    stk.push = (v, i) => {
        stk.preIn((box) => {
            box.v = v;
            let txt = sd.Text(box, v);
            let pos = sd.Text(box, `pos=${i}`);
            let rule_txt = () => {
                txt.cx(box.cx())
                   .my(box.my() - 5);
            }
            let rule_pos = () => {
                pos.width(box.width() - 10)
                   .cx(box.cx())
                   .y(box.my() + 5);
            }
            box.children.push(txt, rule_txt);
            box.children.push(pos, rule_pos);
            box.color(C.ORANGE);
        });
        stk.push_(v);
        return stk;
    }
    return stk;
}

async function push(v, i) {
    stk.startAnimate()
       .push(v, i)
       .endAnimate();
    while (top > 0) {
        let last = Number(stk.element(top).v);
        if (last < v) {
            await sd.pause();
            stk.startAnimate()
               .erase(top)
               .endAnimate();
            top--;
        } else break;
    }
    top++;
    await sd.pause();
    stk.element(top)
       .startAnimate()
       .color(C.BLUE)
       .endAnimate();
}

async function main() {
    for (let i = seq.length - 1; i >= 0; i--) {
        await sd.pause();
        arr.startAnimate()
           .color(i, C.red)
           .endAnimate();

        await sd.pause();
        push(seq[i], i+1);

        await sd.pause();
        arr.startAnimate()
           .color(i, C.white)
           .endAnimate();
    }
}