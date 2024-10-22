import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let g = new sd.BipartiteGraph(svg).x(200).y(100).width(800);

for (let i = 1; i <= 4; i++) 
    g.newNode(`x${i}`, `x${i}`, 0);
for (let i = 1; i <= 4; i++) 
    g.newNode(`y${i}`, `y${i}`, 1);
let edges = [
    ["x1", "y1"],
    ["x1", "y2"],
    ["x2", "y1"],
    ["x2", "y3"],
    ["x3", "y2"],
    ["x3", "y4"],
    ["x4", "y2"],
    ["x4", "y3"]
]
for (let i = 0; i < edges.length; i++)
    g.newLink(edges[i][0], edges[i][1])


sd.main(async () => {
    await match([["x1", "y1"], ["x2", "y3"], ["x3", "y4"]]);
    await match([["x1", "y2"], ["x2", "y1"], ["x3", "y4"], ["x4", "y3"]]);
})

async function match(matches) {
    await sd.pause();
    g.startAnimate();
    for (let i = 0; i < matches.length; i++)
        g.element(matches[i][0], matches[i][1]).stroke(C.red).strokeWidth(5);
    g.endAnimate();
    await sd.pause();
    g.startAnimate();
    for (let i = 0; i < matches.length; i++)
        g.element(matches[i][0], matches[i][1]).stroke(C.black).strokeWidth(1);
    g.endAnimate();
}
