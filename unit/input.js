import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const i = new sd.Input(svg);

main();

async function main() {
    await sd.pause();
    i.startAnimate().label("A").endAnimate();
    await sd.pause();
    console.log("value =", i.value());
    await sd.pause();
}