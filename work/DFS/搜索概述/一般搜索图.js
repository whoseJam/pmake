import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).width(200).height(250).n(4);
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 1],
    [6, 2],
    [4, 8],
    [5, 7],
    [7, 9]
];

sd.init(() => {
    graph.at(0, 0.33).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(2, 0).newNode(3);
    graph.at(3, 0.33).newNode(4);
    graph.at(2, 0.66).newNode(5);
    graph.at(1, 0.66).newNode(6);
    graph.at(3, 1).newNode(7);
    graph.at(4, 0.33).newNode(8);
    graph.at(4, 1).newNode(9);
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
    graph.color(1, C.green);
    graph.color(8, C.orange);
    graph.color(9, C.orange);
})

sd.main(async() => {
    await sd.pause();
});