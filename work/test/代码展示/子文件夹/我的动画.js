import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(20);

main();

async function main() {
    await sd.pause();
}