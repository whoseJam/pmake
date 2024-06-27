import * as sd from "@/SD";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let m = makeKM();

main();

async function main() {
    await m.main();
}

function makeKM() {
    let self = {}, n = 5;
    let g = new sd.BipartiteGraph(svg).x(200).y(100).width(800);
    let to = {}, vis = {}, mat = {};
    for (let i = 1; i <= n; i++) { g.newNode(`x${i}`, `x${i}`, 0); to[`x${i}`] = []; }
    for (let i = 1; i <= n; i++) g.newNode(`y${i}`, `y${i}`, 1);
    let edges = [
        ["x1", "y1", 7], ["x1", "y3", 5], ["x2", "y1", 6], ["x2", "y4", 8], ["x2", "y5", 3],
        ["x3", "y2", 6], ["x3", "y4", 3], ["x4", "y2", 8], ["x4", "y3", 5], ["x4", "y5", 6],
        ["x5", "y1", 5], ["x5", "y4", 8]
    ]
    for (let i = 0; i < edges.length; i++) {
        g.newLink(edges[i][0], edges[i][1]);
        let e = g.element(edges[i][0], edges[i][1]);
        e.value(edges[i][2]);
        let ev = e.value();
        ev.rule = function(parent, child) {
            let y = g.y() + 50;
            let x1 = parent.source()[0], y1 = parent.source()[1];
            let x2 = parent.target()[0], y2 = parent.target()[1];
            let x = x1 + (x2 - x1) / (y2 - y1) * (y - y1);
            child.mx(x).cy(y);
        }
        e.update();
        to[edges[i][0]].push({
            to: edges[i][1],
            value: edges[i][2]
        });
    }
    for (let i = 1; i <= n; i++) {
        let u = `x${i}`, v = `y${i}`, mx = 0;
        for (let j = 0; j < to[u].length; j++)
            mx = Math.max(mx, to[u][j].value);
        g.element(u).childAs("Lx", new sd.Text(svg, mx), function(parent, child) {
            child.cx(parent.cx()).cy(parent.cy() - 30); });
        g.element(v).childAs("Ly", new sd.Text(svg, 0), function(parent, child) {
            child.cx(parent.cx()).cy(parent.cy() + 30); });
    }
    self.main = async function() {
        await showSubGraph();
        for (let i = 1; i <= 5; i++) {
            while (true) {
                vis = {};
                let flag = Dfs(`x${i}`);
                if (flag) {
                    await showMatches();
                    break;
                } else {
                    await adjust();
                    await showSubGraph();
                }
            }
        }
    }
    async function showSubGraph() {
        await sd.pause();
        g.startAnimate()
        for (let i = 0; i < edges.length; i++) {
            let u = edges[i][0], v = edges[i][1], w = edges[i][2];
            let lx = +g.element(u).children.child("Lx").text();
            let ly = +g.element(v).children.child("Ly").text();
            let e = g.element(u, v);
            if (mat[v] === u) continue;
            if (lx + ly === w) e.stroke(C.black).strokeDashArray([10, 0]);
            else e.stroke(C.grey).strokeDashArray([10, 10]);
        }
        g.endAnimate();
    }
    async function showMatches() {
        await sd.pause();
        g.startAnimate();
        for (let i = 0 ; i < edges.length; i++) {
            let u = edges[i][0], v = edges[i][1], e = g.element(u, v);
            if (mat[v] === u) e.stroke(C.red).strokeWidth(5);
            else if (e.stroke() !== C.grey) e.stroke(C.black).strokeWidth(1);
        }
        g.endAnimate();
    }
    function Dfs(u) {
        vis[u] = 1;
        for (let i = 0, v; i < to[u].length; i++) {
            v = to[u][i].to;
            let lx = +g.element(u).children.child("Lx").text();
            let ly = +g.element(v).children.child("Ly").text();
            if (!vis[v] && lx + ly == to[u][i].value) {
                vis[v] = 1;
                if (!mat[v] || Dfs(mat[v])) {
                    mat[v] = u;
                    return true;
                }
            }
        }
        return false;
    }
    async function adjust() {
        await sd.pause();
        let d = Infinity;
        for (let i = 1, u; i <= 5; i++) {
            u = `x${i}`;
            if (!vis[u]) continue;
            for (let j = 0; j < to[u].length; j++) {
                let v = to[u][j].to;
                let w = to[u][j].value;
                if (vis[v]) continue;
                let lx = +g.element(u).children.child("Lx").text();
                let ly = +g.element(v).children.child("Ly").text();
                d = Math.min(d, lx + ly - w);
            }
        }
        for (let i = 1; i <= 5; i++) {
            let u = `x${i}`, v = `y${i}`;
            let Lx = g.element(u).children.child("Lx");
            let Ly = g.element(v).children.child("Ly");
            if (vis[`x${i}`]) changeText(Lx, +Lx.text() - d);
            if (vis[`y${i}`]) changeText(Ly, +Ly.text() + d);
        }
    }
    function changeText(txt, str) {
        txt.startAnimate().opacity(0).endAnimate();
        txt.text(str);
        txt.startAnimate().opacity(1).endAnimate();
    }
    return self;
}