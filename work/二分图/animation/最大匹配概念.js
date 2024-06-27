import * as sd from "@/SD";

let svg = sd.svg();
let C = sd.color();
let g = new sd.BipartiteGraph(svg).x(200).y(100).width(800);

for (let i = 1; i <= 7; i++)
    g.newNode(i, (i <= 4 ? 0 : 1));
g.newLink(1, 5);
g.newLink(1, 6);
g.newLink(2, 5);
g.newLink(3, 6);
g.newLink(3, 7);
g.newLink(4, 7);

main();

async function main() {
    await match([[2, 5]]);
    await match([[1, 5], [3, 7]]);
    await match([[4, 7], [3, 6], [1, 5]]);
}

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
