import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = sd.WithBrace(new sd.Array(svg).resize(20).start(1));
arr.brace(1, 16, "b");
arr.brace(5, 20, "t");
const rect = new sd.Rect(svg).width(40 * 4).color(C.BLUE).drag(true);

init();
main();

function init() {
    rect.cx(arr.cx()).y(arr.my() + 20);
}

async function main() {
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= 5; i += 2) {
        arr.color((i - 1) * 4 + 1, i * 4, C.grey);
    }
    arr.endAnimate();
    await sd.pause();
}