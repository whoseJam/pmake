import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.BipartiteGraph(svg).height(200);
const edges = [
    ["x1", "y1"],
    ["x1", "y2"],
    ["x2", "y1"],
    ["x2", "y3"],
    ["x3", "y2"],
    ["x3", "y4"],
    ["x4", "y2"],
    ["x4", "y3"]
]

sd.init(() => {
    for (let i = 1; i <= 4; i++) 
        graph.newNode(`x${i}`, `x${i}`, 0);
    for (let i = 1; i <= 4; i++) 
        graph.newNode(`y${i}`, `y${i}`, 1);
    for (let i = 0; i < edges.length; i++)
        graph.newLink(edges[i][0], edges[i][1])
})

sd.main(async () => {
    
})