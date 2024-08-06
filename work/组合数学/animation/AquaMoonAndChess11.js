import * as sd from "@/sd";

const svg = sd.svg();

const arr = new sd.Array(svg).resize(16).cx(600).cy(300);

arr.value(1, 1).value(2, 1);
arr.value(10, 1).value(11, 1);

main();

async function main() {
    await move(1);
    await move(2);
    await move(3);
    await move(4);
    await move(5);
    await move(6);
    await move(7);

    await move(10);
    await move(11);
}

async function move(i) {
    await sd.pause();
    const t = arr.element(i).drop();
    arr.startAnimate();
    arr.element(i + 2).valueFromExist(t);
    arr.endAnimate();
}