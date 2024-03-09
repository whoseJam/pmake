
import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let m = makeMaxMatch();

main();

async function main() {
    await m.main();
}

function makeMaxMatch() {
    let self = {};
    let n = 4, m = 4;
    let g = new sd.BipartiteGraph(svg).x(200).y(100).width(800);
    let to = {}, vis = {}, mat = {}, showP = [], moveP = [];
    for (let i = 1; i <= n; i++) { g.newNode(`x${i}`, `x${i}`, 0); to[`x${i}`] = []; }
    for (let i = 1; i <= m; i++) g.newNode(`y${i}`, `y${i}`, 1);
    let edges = [
        ["x1", "y1"], ["x1", "y2"], ["x2", "y1"], ["x2", "y3"],
        ["x3", "y2"], ["x3", "y4"], ["x4", "y2"], ["x4", "y3"]
    ]
    for (let i = 0; i < edges.length; i++) {
        g.newLink(edges[i][0], edges[i][1]);
        to[edges[i][0]].push(edges[i][1]);
    }

    self.main = async function() {
        await sd.pause();
        let ans = 0;
        for (let i = 1; i <= 4; i++) {
            vis = {}; showP = []; moveP = [];
            if (await Dfs(`x${i}`)) ans++;
            await sd.pause();
            g.startAnimate();
            for (let j = 0; j < showP.length; j++) showP[j]();
            g.endAnimate();

            await sd.pause();
            g.startAnimate();
            for (let j = 0 ; j < moveP.length; j++) moveP[j]();
            g.endAnimate();
        }
        return ans;
    }

    async function Dfs(u) {
        for (let i = 0, v; i < to[u].length; i++) {
            v = to[u][i];
            if (!vis[v]) {
                vis[v] = 1;
                if (!mat[v] || await Dfs(mat[v])) {
                    let e = mat[v] ? g.element(mat[v], v) : null;
                    let ne = g.element(u, v);
                    let nu = g.element(u);
                    let nv = g.element(v);
                    showP.push(function() {
                        if (e) e.strokeDashArray([10, 10]);
                        ne.strokeDashArray([10, 10]);
                        nu.color(C.blue);
                        nv.color(C.blue);
                    });

                    mat[v] = u;

                    moveP.push(function() {
                        if (e) e.strokeDashArray([10, 0]).stroke(C.black).strokeWidth(1);
                        ne.strokeDashArray([10, 0]).stroke(C.red).strokeWidth(5);
                        nu.color(C.white);
                        nv.color(C.white);
                    })
                    return true;
                }
            }
        }
        return false;
    }
    return self;
}