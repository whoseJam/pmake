import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 20;
const t = new sd.Tree(svg).width(600).cx(600).y(100);
const links = [
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6],
    [4, 7], [4, 8],
    [5, 9], [5, 10],
    [6, 11], [7, 12], [8, 13], [8, 14], [8, 15],
    [10, 16], [12, 17], [14, 18], [15, 19], [15, 20]
];

init();
main();

function init() {
    t.root(1);
    links.forEach(link => t.link(link[0], link[1]));
}

async function main() {
    await sd.pause();
}
