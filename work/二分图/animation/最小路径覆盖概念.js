import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.DAG(svg).rankDir("LR").height(200);

init();
main();

function init() {
    for (let i = 1; i <= 6; i++) {
        graph.newNode(i);
    }
    function link(u, v) {
        graph.newLink(u, v)
            .element(u, v)
            .arrow();
    }
    link(1, 3);
    link(2, 3);
    link(3, 4);
    link(4, 5);
    link(4, 6);
}

async function main() {
    await sd.pause();
    graph.startAnimate();
    color([[1, 3], [3, 4], [4, 5]], C.red);
    color([[2, 3]], C.deepSkyBlue);
    color([[4, 6]], C.green);
    graph.endAnimate();
    await sd.pause();
}

function color(path, col) {
    path.forEach(edge => {
        graph.element(edge[0], edge[1]).stroke(col);
    });
}