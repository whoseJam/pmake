import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const graph = new sd.BipartiteGraph(svg);
const data = [
    [1, 3],
    [1, 4],
    [3, 2],
    [3, 1],
    [5, 5],
    [4, 5]
];

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        graph.newNode(`X${i}`, 0);
        graph.newNode(`Y${i}`, 1);
        color(`X${i}`);
        color(`Y${i}`);
    }
    data.forEach(item => {
        graph.newLink(`X${item[0]}`, `Y${item[1]}`);
    });
    function color(node) {
        if (node !== "X1" && node !== "X3" && node !== "Y5") {
            graph.color(node, C.blue);
        }
    }
}

async function main() {
    await sd.pause();
}