import * as sd from "#lib/slide";

let svg = sd.svg();
let rule = sd.rule();
let H = sd.helper();
let C = sd.color();
let g = sd.Graph(svg);
let prt = {};
let n = 7;
let m = 11;
let edges = H.ForwardStar();
let e = [
    [1, 2, 12],
    [1, 6, 16],
    [1, 7, 14],
    [2, 3, 10],
    [2, 6, 7],
    [3, 4, 3],
    [6, 3, 6],
    [5, 4, 4],
    [6, 5, 2],
    [7, 5, 8],
    [7, 6, 9]
];

for (let i = 1; i <= n; i++) g.newNode(i, i);
for (let i = 0; i < m; i++) {
    g.newLink(e[i][0], e[i][1], sd.Text(svg, e[i][2]).fontSize(25));
    edges.link(e[i][0], e[i][1], e[i][2]);
    edges.link(e[i][1], e[i][0], e[i][2]);
}
g.width(500).height(500).cx(300).cy(300);

main();

async function main() {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        let table = sd.VarTable(svg);
        table.put("dis", Infinity);
        table.put("vis", "false");
        table.drag(true);
        g.element(i).children.push(
            "table", table,
            rule.OnRightSide(),
        );
        table.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    await Dijkstra(1);
}

function setDis(at, newDis) {
    g.startAnimate()
    g.element(at).children.child("table").put("dis", newDis)
    g.endAnimate();
}

function getDis(at) {
    return +g.element(at).children.child("table").find("dis").text();
}

function getEdge(x, y) {
    let l;
    try {
        l = g.element(x, y);
    } catch(e) {
        l = g.element(y, x);
    }
    return l;
}

async function Dijkstra(S) {
    await sd.pause();
    g.startAnimate().color(S, C.green).endAnimate();
    await sd.pause();
    setDis(S, 0);
    await sd.pause();
    g.startAnimate().color(S, C.white).endAnimate();
    let vis = sd.make1d(100, 0);
    for (let i = 1; i <= n; i++) {
        let cur = 0, curDis = Infinity;
        for (let j = 1; j <= n; j++) {
            if (vis[j]) continue;
            if (curDis > getDis(j)) {
                curDis = getDis(j);
                cur = j;
            }
        }
        await sd.pause();
        g.startAnimate();
        g.color(cur, C.orange)
        g.element(cur).children.child("table").put("vis", "true");
        g.endAnimate();
        vis[cur] = true;
        
        let adj = edges.adjacent(cur);
        for (let j = 0; j < adj.length; j++) {
            let v = adj[j].to, w = adj[j].value;
            if (vis[v]) continue;
            await sd.pause();
            g.startAnimate().color(v, C.blue).endAnimate();
            g.startAnimate();
            let l = getEdge(cur, v);
            l.strokeWidth(3)
            l.stroke(C.red);
            g.endAnimate();
            let newDis = Math.min(getDis(cur) + w, getDis(v));
            if (getDis(v) > newDis) {
                await sd.pause();
                if (prt[v]) {
                    let p = prt[v];
                    p.markerEnd(null);
                    p.startAnimate();
                    p.strokeDashOffset(p.totalLength());
                    p.endAnimate();
                    p.remove();
                }
                let link = sd.Link(l);
                let src = l.source();
                let tgt = l.target();
                link.source(src[0], src[1]);
                link.target(tgt[0], tgt[1]);
                link.strokeWidth(3);
                link.strokeDashArray(link.totalLength());
                link.strokeDashOffset(link.totalLength());
                link.startAnimate();
                link.strokeDashOffset(0)
                link.endAnimate();
                link.arrow();
                prt[v] = link;
                setDis(v, newDis);
            }
            await sd.pause();
            g.startAnimate()
            g.color(v, C.white);
            l.strokeWidth(1).stroke(C.black);
            g.endAnimate();
        }
        await sd.pause();
        g.startAnimate()
        g.color(cur, C.grey);
        g.element(cur).children.child("table").color(C.grey);
        g.endAnimate();
    }
}