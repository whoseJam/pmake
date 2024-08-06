import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.DAG(svg).width(100).height(100).rankDir("LR");
const Q = new sd.Array(svg).elementWidth(100).x(250).cy(100/3-10);
const q = new sd.Array(svg).elementWidth(100).x(250).cy(200/3+10);
const links = [5, 2, 3];
sd.Label(Q, "普通队列");

init();
main();

function init() {
    graph.link(1, 2, 1);
    graph.link(1, 3, 1);
    graph.link(1, 4, 1);
}

async function main() {
    await sd.pause();
    for (let i = 2; i <= 4; i++) {
        Q.startAnimate().push(`u=${i} dis=1`).endAnimate();
    }
    await sd.pause();
    graph.startAnimate();
    for (let i = 2; i <= 4; i++) {
        graph.value(1, i, links[i-2]);
    }
    graph.endAnimate();
    await sd.pause();
    sd.Label(q, "普通队列'");
    for (let i = 2; i <= 4; i++) {
        q.startAnimate().push(`u=${i} dis=${links[i-2]}`).endAnimate();
    }
    await sd.pause();
}