import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = new sd.DAG(svg).cx(800).cy(300);
let arr = new sd.Array(svg).x(200).y(100);
let seq = new sd.Array(svg).x(200).y(300);
sd.Label(seq, "拓扑序", "lc", 20);
sd.Label(arr, "辅助队列", "lc", 20);
let ind = {};
let n = 9, m = 10;
let e = [
    ["1", "3"],
    ["1", "4"],
    ["2", "5"],
    ["3", "5"],
    ["4", "6"],
    ["5", "7"],
    ["5", "8"],
    ["6", "8"],
    ["7", "9"],
    ["8", "9"]
];
let grad = C.gradient(C.white, "#1E90FF", 0, 2);

for (let i = 1; i <= n; i++) {
    g.newNode(String(i), i);
    g.element(String(i)).rate(1.8);
    ind[i] = 0;
}
for (let i = 0; i < m; i++) {
    g.newLink(e[i][0], e[i][1]);
    g.element(e[i][0], e[i][1]).arrow().strokeWidth(1.2);
    ind[e[i][1]]++;
}

main();

async function main() {
    await sd.pause();
    g.startAnimate();
    for (let i = 1; i <= n; i++) {
        let idx = i;
        g.color(idx, grad(ind[idx]));
    }
    g.endAnimate();
    for (let i = 1; i <= n; i++) {
        let idx = i;
        if (ind[idx] === 0) {
            await sd.pause();
            g.element(idx).startAnimate().stroke(C.red).strokeWidth(5).endAnimate();
            await sd.pause();
            arr.startAnimate()
            arr.push(idx);
            arr.element(arr.end()).rate(1.8);
            arr.endAnimate();
            await sd.pause();
            g.element(idx).startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
        }
    }
    while (arr.length() > 0) {
        await sd.pause();
        let u = arr.value(0).text();
        let value = arr.value(0);
        arr.startAnimate().erase(0).endAnimate();
        value.attachTo(svg);
        seq.startAnimate().pushFromExistValue(value).endAnimate();
        await sd.pause();
        g.startAnimate().color(u, C.orange).endAnimate();
        let adj = g.outLinks(u);
        for (let i = 0; i < adj.length; i++) {
            let v = adj[i].toNodeId; ind[v]--;
            await sd.pause();
            g.startAnimate().color(v, grad(ind[v])).endAnimate();
            if (ind[v] === 0) {
                await sd.pause();
                g.startAnimate().color(v, C.green).endAnimate();
                await sd.pause();
                arr.startAnimate().push(v).endAnimate();
                await sd.pause();
                g.startAnimate().color(v, C.white).endAnimate();
            }
        }
    }
    await sd.pause();
}
