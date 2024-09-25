import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [2, 4, 1, 3, 6, 5];
const arr = new sd.BarArray(svg);

const addButton = new sd.Button(svg).text("添加一个元素");
const addInput = new sd.Input(svg);
addButton.childAs("input", addInput, R.Aside("rc"));
const popButton = new sd.Button(svg).text("删除一个元素");

let interacting = false;

addButton.onClick(() => {
    if (interacting) return;
    interacting = true;
    const value = +addInput.text();
    add(value);
})

popButton.onClick(() => {
    if (interacting) return;
    interacting = true;
    pop();
})

sd.init(() => {
})

sd.main(async () => {
})

async function add(x) {
    await sd.pause();
    arr.startAnimate().push(x).color(arr.end(), C.blue).endAnimate();
    
    while (arr.length() >= 2 && arr.intValue(arr.end() - 1) <= arr.intValue(arr.end())) {
        await sd.pause();
        arr.startAnimate().erase(arr.end() - 1).endAnimate();
    }

    await sd.pause();
    arr.startAnimate().color(C.white).endAnimate();
    interacting = false;
}

async function pop(x) {
    if (arr.length() > 0) {
        await sd.pause();
        arr.startAnimate().erase(0).endAnimate();
    }
    interacting = false;
}