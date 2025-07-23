import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 4;
const grid1 = new sd.Grid(svg).n(n + m).m(n + m).startN(1).startM(1).elementWidth(20).elementHeight(20);
const grid2 = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const graph = new sd.BipartiteGraph(svg);
const links = [
    [1, 1],
    [1, 2],
    [3, 2],
    [2, 4],
    [4, 1]
];

sd.init(() => {
    for (let i = 1; i <= n; i++)
        graph.newNode(i, new sd.Mathjax(graph, `x_${i}`), 0);
    for (let i = 1; i <= m; i++)
        graph.newNode(i + n, new sd.Mathjax(graph, `y_${i}`), 1);
    for (let i = 1; i <= n + m; i++)
        graph.element(i).rate(2);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            grid1.color(i, j, C.grey);
    for (let i = 1 + m; i <= n + m; i++)
        for (let j = 1 + m; j <= n + m; j++)
            grid1.color(i, j, C.grey);
    links.forEach(link => {
        grid1.value(link[0], link[1] + n, 1);
        grid1.value(link[1] + n, link[0], 1);
        grid2.value(link[0], link[1], 1);
        graph.link(link[0], link[1] + n);
    });
    graph.cx(600);
    grid1.cx(graph.kx(0.33)).y(graph.my() + 40).opacity(0);
    grid2.cx(graph.kx(0.66)).y(graph.my() + 40).opacity(0);
})

sd.main(async () => {
    await sd.pause();
    grid1.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    grid2.startAnimate().opacity(1).endAnimate();
})
