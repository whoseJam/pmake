import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let bottom = svg.append("g");
let top = svg.append("g");
let lens = [6, 4, 3, 2, 2, 2, 2, 2, 2, 2, 1];
let lengthPerContainer;
let n = lens.length;
let ilen = 40;
let sticks = [];
let heaps = [];

for (let i = 0; i < lens.length; i++) {
    let stick = sd.Rect(top).color(C.ORANGE);
    stick.l = lens[i];
    stick.width(ilen).height(ilen * lens[i]);
    let txt = sd.Text(stick, lens[i]);
    let rule = () => { txt.cx(stick.cx()).cy(stick.cy()); };
    stick.children.push(txt, rule);
    sticks.push(stick);
}
update();

main();

async function main() {
    lengthPerContainer = 6;
    await Dfs(0, 0);
}

async function Dfs(usedSticksNum, resLength) {
    if (usedSticksNum === n) {
        if (resLength === 0)
            throw new Error("END");
        return;
    }
    let newFlag = false;
    if (resLength === 0) {
        await sd.pause();
        newFlag = true;
        resLength = lengthPerContainer;
        let heap = [];
        let rect = sd.Rect(bottom);
        rect.width(ilen).color(C.BLUE);
        rect.height(ilen * lengthPerContainer);
        heap.container = rect;
        heaps.push(heap);
        update();
        rect.opacity(0).startAnimate().opacity(1).endAnimate();
        resLength = lengthPerContainer;
    }
    for (let i = 0; i < n; i++) {
        if (!sticks[i].inHeap && resLength >= sticks[i].l) {
            let heap = heaps[heaps.length - 1];
            let lastFlag = (resLength === sticks[i].l);
            if (heap.length > 0 && 
                heap[heap.length - 1].l < sticks[i].l) {
                continue;
            }

            await sd.pause();
            startAnimate();
            sticks[i].inHeap = true;
            heap.push(sticks[i]);
            update();
            endAnimate();

            await Dfs(usedSticksNum + 1, resLength - sticks[i].l);
            
            await sd.pause();
            startAnimate();
            sticks[i].inHeap = false;
            heap.pop();
            update();
            endAnimate();

            if (newFlag) break;
            if (lastFlag) break;
        }
    }
    if (newFlag) {
        await sd.pause();
        let heap = heaps[heaps.length - 1];
        heap.container.startAnimate().dy(-50).opacity(0).endAnimate();
        heap.container.remove();
        heaps.pop();
    }
}

function startAnimate() {
    for (let i = 0; i < sticks.length; i++)
        sticks[i].startAnimate();
}

function endAnimate() {
    for (let i = 0; i < sticks.length; i++)
        sticks[i].endAnimate();
}

function update() {
    let x = 100, y = 500;
    for (let i = 0; i < sticks.length; i++) {
        if (!sticks[i].inHeap) {
            sticks[i].x(x).my(y);
            x += sticks[i].width();
        }
    }
    x = 700; y = 500;
    for (let i = 0; i < heaps.length; i++) {
        let heap = heaps[i];
        let container = heap.container;
        container.x(x).my(y);
        let cury = y;
        for (let j = 0; j < heap.length; j++) {
            let stick = heap[j];
            stick.x(x).my(cury);
            cury -= stick.height();
        }
        x += container.width();
    }
}