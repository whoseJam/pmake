import * as sd from "../lib/slide";

const p = Promise.resolve();
export function nextTick(fn) {
	return fn ? p.then(fn) : p;
}

main();

async function main() {
    await sd.pause();
    nextTick(function() {
        console.log("in nextTick");
    })
    for (let i = 1; i <= 10; i++)
        console.log(i)
    await sd.pause();
    r.startAnimate(1000).color(C.red).endAnimate();
}