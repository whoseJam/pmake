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
    ["V1", "V3"],
    ["V1", "V4"],
    ["V2", "V5"],
    ["V3", "V5"],
    ["V4", "V6"],
    ["V5", "V7"],
    ["V5", "V8"],
    ["V6", "V8"],
    ["V7", "V9"],
    ["V8", "V9"]
];
let grad = C.gradient(C.white, "#1E90FF", 0, 2);

for (let i = 1; i <= n; i++) {
    g.newNode("V" + i, "V" + i);
    g.element("V" + i).rate(1.8);
    ind["V" + i] = 0;
}
for (let i = 0; i < m; i++) {
    g.newLink(e[i][0], e[i][1]);
    g.element(e[i][0], e[i][1]).arrow().strokeWidth(1.2);
    ind[e[i][1]]++;
}

main();

async function main() {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        let idx = "V" + i;
        g.startAnimate().color(idx, grad(ind[idx])).endAnimate();
    }
    for (let i = 1; i <= n; i++) {
        let idx = "V" + i;
        if (ind[idx] === 0) {
            await sd.pause();
            g.element(idx).startAnimate().stroke(C.red).strokeWidth(2).endAnimate();
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
        seq.startAnimate();
        seq.pushFromExistValue(value);
        seq.endAnimate();
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
                arr.startAnimate().push(v).endAnimate();
                g.startAnimate().color(v, C.white).endAnimate();
            }
        }
    }
}
