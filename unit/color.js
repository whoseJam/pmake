import * as sd from "@/sd";

const C = sd.color();

const arr = new sd.Array(svg).push(4);

arr.push(5);

arr.pop();

async function main(params) {
    await sd.pause();
}