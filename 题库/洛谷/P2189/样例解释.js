import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const graph = new sd.TinyGraph(svg).scale(0.5);
const array = new sd.Array(svg);

sd.init(() => {
    for (let i = 1; i <= n; i++) graph.newNode(i);
    for (let i = 1; i <= n; i++) graph.link(i, (i % n) + 1);
    array.pushArray([4, 1, 3]);
    array.cx(graph.cx()).my(graph.y() - 20);
    graph.forEachNode(node => {
        node.onClick(() => {
            let flag = 0;
            sd.inter(async () => {
                node.startAnimate()
                    .color(flag ? C.white : C.grey)
                    .endAnimate();
            });
        });
    });
});

sd.main(async () => {});
