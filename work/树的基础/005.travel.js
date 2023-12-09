import * as sd from "#lib/slide";

let svg = sd.svg();
let H = sd.helper();
let C = sd.color();
let t = sd.Tree(svg).width(800).x(100).y(100);
let circ = sd.Circle(svg).stroke(C.red).strokeWidth(4).fillOpacity(0);
let edges = H.ForwardStar();
t.root(1);

function link(x, y) {
    t.link(x, y);
    edges.link(x, y);
}

link(1, 2);
link(1, 3);
link(2, 4);
link(2, 5);
link(3, 6);
link(3, 7);
link(3, 8);

main();

async function main() {
    circ.cx(t.element(1).cx()).cy(t.element(1).cy());
    await Dfs(1, 0);
}

async function Dfs(u, f) {
    await sd.pause();
    circ.startAnimate().cx(t.element(u).cx()).cy(t.element(u).cy()).endAnimate();
    t.startAnimate().color(u, C.green).endAnimate();

    let ts = edges.adjacent(u);
    for (let i = 0; i < ts.length; i++) {
        let v = ts[i].to;
        if (v === f) continue;
        await Dfs(v, u);

        await sd.pause();
        circ.startAnimate().cx(t.element(u).cx()).cy(t.element(u).cy()).endAnimate();
    }
    await sd.pause();
    t.startAnimate().color(u, C.grey).endAnimate();
}