import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).width(100).height(100);
const links = [
    [1, 2, 5],
    [1, 4, 2],
    [1, 3, 4],
    [2, 3, 1],
    [3, 4, 3]
];
const slider = new sd.Slider(svg).min(0).max(5).width(100).value(0);
slider.onChange(value => {
    console.log("value=", value);
    links.forEach(data => {
        if (data[2] > value) {
            graph.element(data[0], data[1]).strokeDashArray([5, 0]).stroke(C.black);
        } else {
            graph.element(data[0], data[1]).strokeDashArray([5, 5]).stroke(C.grey);
        }
    })
});

init();
main();

function init() {
    graph.at(0, 0).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(1, 1).newNode(3);
    graph.at(0, 1).newNode(4);
    function link(a, b, v) {
        graph.newLink(a, b);
        graph.element(a, b).value(v);
    }
    links.forEach(data => {
        link(data[0], data[1], data[2]);
    });
    slider.cx(graph.cx()).y(graph.my() + 20);
}

async function main() {
    await sd.pause();
}