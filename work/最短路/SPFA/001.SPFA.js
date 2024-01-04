import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let g = sd.Graph(svg).width(200).cx(300).cy(300);
let n = 4;
let to = {};
let q = sd.Array(svg);
let inq = sd.Array(svg).resize(4).start(1).indexed(true), Inq = sd.make1d(100, 0);
let dis = sd.Array(svg).resize(4).start(1).indexed(true), Dis = sd.make1d(100, 1e9);
inq.x(700).y(100); sd.EnableArrayName(inq, "inq");
dis.x(700).y(200); sd.EnableArrayName(dis, "dis");
q.x(700).y(300); sd.EnableArrayName(q, "队列");

let edges = [
    [1, 2, 2],
    [1, 3, 3],
    [3, 2, -2],
    [2, 4, 1]
];
for (let i = 1; i <= n; i++) {
    g.newNode(i);
    to[i] = [];
}
for (let i = 0; i < edges.length; i++) {
    g.newLink(edges[i][0], edges[i][1], sd.Text(svg, edges[i][2]).fontSize(20));
    let e = g.element(edges[i][0], edges[i][1]);
    e.arrow().valueRule(R.PointAtPathByRate(0.5, "x", "y"));
    to[edges[i][0]].push([edges[i][1], edges[i][2]]);
}

main();

async function main() {
    await SPFA(1);
}

function toText(x) {
    if (x == 1e9) return "inf";
    return x;
}

async function SPFA(S) {
    Dis[S] = 0; Inq[S] = 1;
    for (let i = 1; i <= n; i++) {
        dis.value(i, toText(Dis[i]));
        inq.value(i, Inq[i]);
    }
    let Q = [S];
    q.push(sd.Vertex(svg).value(S));
    while (Q.length > 0) {
        let u = Q[0]; Q.splice(0, 1);
        await sd.pause();
        q.startAnimate().color(0, C.green).endAnimate()
        g.after(q).startAnimate().color(u, C.green).endAnimate();
        q.startAnimate().erase(0).endAnimate();
        inq.after(g).startAnimate().color(u, C.green).endAnimate();
        inq.startAnimate().value(u, Inq[u]=0).endAnimate();
        for (let i = 0; i < to[u].length; i++) {
            let v = to[u][i][0];
            let w = to[u][i][1];
            if (Dis[v] > Dis[u] + w) {
                await sd.pause();
                Dis[v] = Dis[u] + w;
                g.startAnimate().color(v, C.blue).endAnimate();
                dis.after(g).startAnimate().color(v, C.blue).endAnimate();
                dis.startAnimate().value(v, Dis[v]).endAnimate();
                inq.after(dis).startAnimate().color(v, C.blue).endAnimate();
                if (!Inq[v]) {
                    inq.startAnimate().value(v, Inq[v]=1).endAnimate();
                    Q.push(v);
                    q.startAnimate().push(sd.Vertex(svg).value(v)).endAnimate();
                }
                await sd.pause();
                g.startAnimate().color(v, C.white).endAnimate();
                dis.startAnimate().color(v, C.white).endAnimate();
                inq.startAnimate().color(v, C.white).endAnimate();
            }
        }
        await sd.pause();
        g.startAnimate().color(u, C.white).endAnimate();
        inq.startAnimate().color(u, C.white).endAnimate();
    }
}