import *  as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).start(1);

main();

async function main() {
    for (let i = 1; i <= 10; i++) {
        arr.push(i);
    }
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= 10; i++) {
        if (isPrime(i)) {
            arr.color(i, C.blue);
        }
    }
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= 10; i++) {
        if (isPrime(i)) {
            arr.color(i, C.red);
        }
    }
    arr.endAnimate();
    await sd.pause();
    const p = sd.Pointer(arr, "p");
    p.startAnimate().moveTo(6).endAnimate();
    await sd.pause();
    p.startAnimate().moveTo(1).endAnimate();
    await sd.pause();
    p.startAnimate().moveTo(7).endAnimate();
    await sd.pause();
    p.startAnimate().moveTo(2).endAnimate();
    await sd.pause();
    p.startAnimate().moveTo(4).endAnimate();
    await sd.pause();
    for (let i = 10; i >= 1; i--) {
        if (isPrime(i)) {
            arr.startAnimate().erase(i).endAnimate();
        }
    }
    await sd.pause();
}

function isPrime(x) {
    if (x === 1) return false;
    for (let i = 2; i < x; i++) {
        if (x % i === 0) return false;
    }
    return true;
}