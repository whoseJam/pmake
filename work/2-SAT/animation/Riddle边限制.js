import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(100);

init();
main();

function init() {
    graph.at(0, 0).newNode(1, "u");
    graph.at(0, 1).newNode(2, "v");
    graph.link(1, 2);
}

async function main() {
    await sd.pause();
}