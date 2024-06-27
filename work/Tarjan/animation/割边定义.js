import * as sd from "@/SD";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).cx(600).cy(300);
const data = [
    [1, 2], [1, 3],
    [2, 3],
    [3, 6],
    [4, 5], [4, 6],
    [5, 6],
    [6, 7]
];

init();
main();

function init() {
    graph.at(0.25, 0).newNode(1);
    graph.at(0.75, 0).newNode(2);
    graph.at(0.5, 0.5).newNode(3);
    graph.at(1, 0.5).newNode(4);
    graph.at(1, 1).newNode(5);
    graph.at(0.5, 1).newNode(6);
    graph.at(0, 1).newNode(7);
    data.forEach(link => {
        graph.newLink(link[0], link[1]);
    })
}

async function main() {
    await sd.pause();
}