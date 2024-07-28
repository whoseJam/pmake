import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const t = new sd.Tree(svg).width(600).cx(600).y(100);
const links = [
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6]
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