import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.DAG(svg).width(400).height(200);
const links = [
    [1, 2],
    [1, 3],
    [2, 5],
    [4, 7],
    [6, 7],
    [3, 8],
    [3, 9],
    [1, 9]
];
const vis = sd.make1d(40);

sd.init(() => {
    links.forEach(link => {
        graph.link(link[0], link[1]);
    });
})

sd.main(async () => {
    const dfs = async (u) => {
        vis[u] = 1;
        await sd.pause();
        graph.startAnimate().color(u, C.blue).endAnimate();
        graph.forEachOutNodesSync(u, async (node) => {
            const v = node.nodeId;
            if (!vis[v]) {
                await dfs(v);
            }
        }, "undirect");
    };
    dfs(1);
})