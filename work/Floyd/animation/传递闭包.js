import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.DAG(svg).width(200).height(200);

init();
main();

function init() {
    graph.freeze();
    for (let i = 1; i <= 6; i++) {
        graph.newNode(i);
    }
    function link(a, b) {
        graph.link(a, b);
        graph.element(a, b).arrow();
    }
    link(1, 2);
    link(3, 2);
    link(2, 4);
    link(2, 5);
    link(3, 6);
    graph.unfreeze();
}

async function main() {
    await sd.pause();
}