import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const data = [
    { a: 3, b: 5, c: 1 },
    { a: 6, b: 4, c: 4 },
    { a: 2, b: 3, c: 8 },
    { a: 3, b: 7, c: 2 },
    { a: 5, b: 6, c: 9 },
    { a: 4, b: 1, c: 6 },
    { a: 7, b: 2, c: 7 },
    { a: 9, b: 8, c: 3 },
    { a: 8, b: 9, c: 5 },
];
const n = data.length;
const tables = [];
const tableObj = {
    startAnimate: function() {
        tables.forEach(table => table.startAnimate());
        return this;
    },
    endAnimate: function() {
        tables.forEach(table => table.endAnimate());
        return this;
    },
    update: update
};
const arr = new sd.Array(svg).start(1);
const pCur = sd.Pointer(svg, "cur");
const pI = sd.Pointer(svg, "i");
const focus = sd.Focus(arr);

sd.init(() => {
    data.forEach((item, idx) => {
        tables.push(new sd.Stack(svg)
            .elementWidth(80)
            .push(`a=${item.a}`)
            .push(`b=${item.b}`)
            .push(`c=${item.c}`));
        item.id = idx;
    });
    for (let i = 1; i <= 10; i++) {
        arr.push(i);
        const e = arr.lastElement();
        e.childAs("stk", new sd.Stack(e).elementWidth(20).elementHeight(20), R.Aside("bc"));
    }
    tableObj.update();
    arr.cx(100 + 4.5 * 100).y(520);
})

sd.main(async () => {
    await sd.pause();
    sortSubarray(data, 0, n - 1, (a, b) => a.a - b.a);
    tableObj.startAnimate().update().endAnimate();
    
    await CDQ(0, n - 1);
})

function sortSubarray(arr, l, r, cmp) {
    const subArr = arr.slice(l, r + 1);
    subArr.sort(cmp);
    for (let i = l; i <= r; i++)
        arr[i] = subArr[i - l];
}

async function CDQ(l, r) {
    if (l === r) return;
    let mid = (l + r) >> 1;
    await CDQ(l, mid);
    await CDQ(mid + 1, r);

    await sd.pause();
    const boxL = tables[data[l].id].x();
    const boxR = tables[data[r].id].mx();
    const brace = new sd.BraceCurve(svg)
        .target(boxL, arr.y() - 20)
        .source(boxR, arr.y() - 20)
        .opacity(0)
        .startAnimate().opacity(1).endAnimate();
    let cur = l - 1;
    for (let i = mid + 1; i <= r; i++) {
        await sd.pause();
        pI.startAnimate().moveTo(tables[data[i].id]).endAnimate();
        while (cur + 1 <= mid && data[cur + 1].b <= data[i].b) {
            await sd.pause();
            cur++;
            pCur.startAnimate().moveTo(tables[data[cur].id]).endAnimate();
            await sd.pause();
            tables[data[cur].id].startAnimate().color(C.blue).endAnimate();
            insert(data[cur].c);
        }
        await sd.pause();
        const elemC = tables[data[i].id].element(2);
        elemC.startAnimate().strokeWidth(3).stroke(C.red).endAnimate();
        focus.startAnimate().focus(1, data[i].c).endAnimate();
        await sd.pause();
        elemC.startAnimate().strokeWidth(1).stroke(C.black).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
    }
    await sd.pause();
    pI.startAnimate().opacity(0).endAnimate();
    pCur.startAnimate().opacity(0).endAnimate();
    brace.startAnimate().opacity(0).remove();
    clear();
    for (let i = l; i <= cur; i++)
        tables[data[i].id].startAnimate().color(C.white).endAnimate();

    await sd.pause();
    sortSubarray(data, l, r, (a, b) => a.b - b.b);
    tableObj.startAnimate().update().endAnimate();
}

function insert(pos) {
    const e = arr.element(pos);
    const stk = e.child("stk");
    stk.startAnimate().push().color(C.blue).endAnimate();
}

function clear() {
    for (let i = arr.start(); i <= arr.end(); i++) {
        const e = arr.element(i);
        const stk = e.child("stk");
        stk.startAnimate().resize(0).endAnimate();
    }
}

function update() {
    const realX = (i) => {
        return 100 + i * 100 
    };
    const realY = (j) => {
        return 380 - j * 30;
    };
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const table = tables[item.id];
        table.x(realX(i)).y(realY(item.b));
    }
    return this;
}