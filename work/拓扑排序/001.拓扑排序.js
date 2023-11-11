import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let H = sd.helper();
let g = sd.Graph(svg).cx(800).cy(300);
let arr = sd.Array(svg).x(200).y(100);
let seq = sd.Array(svg).x(200).y(300);
sd.EnableArrayName(seq, "拓扑序", 20);
sd.EnableArrayName(arr, "辅助队列", 20);
let ind = {};
let n = 9, m = 10;
let edges = H.ForwardStar();
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
    ind["V" + i] = 0;
}
for (let i = 0; i < m; i++) {
    g.newLink(e[i][0], e[i][1]);
    g.element(e[i][0], e[i][1]).arrow().strokeWidth(1.2);
    edges.link(e[i][0], e[i][1]);
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
            arr.startAnimate().push(idx).endAnimate();
            await sd.pause();
            g.element(idx).startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
        }
    }
    while (arr.length() > 0) {
        await sd.pause();
        let u = arr.value(0).text();
        let value = arr.value(0);
        arr.element(0).drop();
        arr.startAnimate().erase(0).endAnimate();
        await sd.pause();
        
        seq.startAnimate();
        seq.push();
        seq.element(arr.end()).mode("weak").value(value).mode("strong");
        seq.endAnimate();
        await sd.pause();
        g.startAnimate().color(u, C.orange).endAnimate();
        let adj = edges.adjacent(u);
        for (let i = 0; i < adj.length; i++) {
            let v = adj[i].to; ind[v]--;
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
