import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).start(1);
const data = [2, 5, 3, 4, 6, 3, 2, 5];

const stack = new sd.ValueStack(svg);
const input = new sd.Input(stack).label("d");
const button = new sd.Button(stack).text("开始增加");
button.onClick(() => {
    add();
})
stack.push(input).push(button);

init();
main();

function init() {
    data.forEach(value => arr.push(value));
    stack.cx(arr.cx()).y(arr.my() + 20);
}

async function main() {
    await sd.pause();
}

async function add() {
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= data.length; i++) {
        const value = arr.intValue(i);
        arr.value(i, value + (+input.value()));
    }
    arr.endAnimate();
}