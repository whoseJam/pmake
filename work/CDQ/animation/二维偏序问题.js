import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [
    { x: 4, y: 2 },
    { x: 6, y: 1 },
    { x: 5, y: 3 },
    { x: 8, y: 4 },
    { x: 3, y: 9 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 7, y: 7 },
    { x: 9, y: 8 }
];
const arr = new sd.ValueArray(svg).x(100).y(100).elementWidth(100);
const tree = new sd.Array(svg).resize(10);

init();
main();

function init() {
    data.forEach(value => {
        const stk = new sd.Stack(arr).elementWidth(80);
        stk.valueX = value.x;
        stk.valueY = value.y;
        stk.push(`x=${value.x}`)
            .push(`y=${value.y}`);
        arr.push(stk);
    });
    tree.cx(arr.cx()).y(arr.my() + 50).start(1);
    for (let i = 1; i <= tree.length(); i++) {
        const e = tree.element(i);
        e.childAs("stk", new sd.Stack(e).elementWidth(20).elementHeight(20), R.Aside("bc"));
    }
}

async function main() {
    await sd.pause();
    const group = [];
    for (let i = 0; i < data.length; i++) {
        const e = arr.element(0);
        group.push({
            element: e,
            x: e.valueX,
            y: e.valueY
        });
        arr.dropElement(0);
    }
    group.sort((a, b) => a.x - b.x);
    arr.startAnimate();
    for (let i = 0; i < group.length; i++) {
        arr.pushFromExistElement(group[i].element);
    }
    arr.endAnimate();
    
    const focus = new sd.Focus(tree);
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        arr.startAnimate().color(i, C.blue).endAnimate();
        await sd.pause();
        const e = arr.element(i);
        focus.startAnimate().focus(1, e.valueY).endAnimate();
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
        await sd.pause();
        insert(e.valueY);
        await sd.pause();
        arr.startAnimate().color(i, C.white).endAnimate();
    }
    await sd.pause();
}

function insert(pos) {
    const e = tree.element(pos);
    const stk = e.child("stk");
    stk.startAnimate().push().color(C.blue).endAnimate();
}