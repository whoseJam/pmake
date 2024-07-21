import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg).n(5).m(5);

main();

async function main() {
    await sd.pause();
}