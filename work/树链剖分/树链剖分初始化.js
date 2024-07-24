import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let t = makeTree();

main();

async function main() {
    await sd.pause();

    t.startAnimate();
    await t.dfs1(1, 0);
    t.endAnimate();

    await t.dfs2(1, 1);
}
function makeTree() {
    let h = sd.make1d(100), l = sd.make1d(100), cnt = 0;
    let sz = sd.make1d(100), sn = sd.make1d(100), top = sd.make1d(100);
    let dep = sd.make1d(100), pos = sd.make1d(100), rpos = sd.make1d(100), fa = sd.make1d(100);
    let tr = new sd.Tree(svg).layerHeight(60).width(1100).cx(600).y(50);
    let arr = new sd.Array(svg).x(100).cy(500).start(1);
    let edges = [
        [1, 2], [1, 3], [1, 4], [2, 5], [3, 6],
        [3, 7], [4, 8], [5, 9],[5, 10],[6, 11],
        [7, 12], [8, 13], [8, 14], [10, 15], [11, 16],
        [16, 17], [16, 18]
    ]

    tr.root(1);
    for (let i = 0; i < edges.length; i++)
        link(edges[i][0], edges[i][1]);

    tr.dfs1 = async function dfs1(now, prt) {
        sz[now] = 1; fa[now] = prt; dep[now] = dep[prt] + 1;
        for (let i = h[now]; i; i = l[i].nxt) {
            let v = l[i].to;
            if (v !== prt) {
                await dfs1(v, now);
                if (sz[sn[now]] < sz[v])
                    sn[now] = v;
                sz[now] += sz[v];
            }
        }
        if (sn[now]) {
            tr.element(now, sn[now]).strokeWidth(5);
            tr.element(now, sn[now]).stroke(C.red);
        }
    }
    tr.dfs2 = async function dfs2(now, t) {
        await sd.pause();
        tr.startAnimate();
        if (fa[now]) tr.color(fa[now], C.DEFAULT);
        tr.color(now, C.GREEN);
        tr.endAnimate();
        await sd.pause();
        arr.startAnimate().push(`${now}`).endAnimate();
        await sd.pause();
        pos[now] = arr.length();
        rpos[arr.length()] = now;
        top[now] = t;

        let l1 = linkTo(tr.element(now), arr.element(arr.end()), "pos");
        let l2 = linkTo(arr.element(arr.end()), tr.element(now), "rpos");
        let l3 = linkTo(tr.element(now), tr.element(t), "top");
        await sd.pause();
        l1.startAnimate().remove();
        l2.startAnimate().remove();
        l3.startAnimate().remove();

        if (sn[now]) await dfs2(sn[now], t);
    
        for (let i = h[now]; i; i = l[i].nxt) {
            let v = l[i].to;
            if (v !== fa[now] && v !== sn[now]) {
                await dfs2(v, v);
            }
        }
        await sd.pause();
        tr.startAnimate();
        if (fa[now]) tr.color(fa[now], C.GREEN);
        tr.color(now, C.DEFAULT);
        tr.endAnimate();
    }
    function linkTo(from, to, label) {
        let l = new sd.Curve(svg);
        l.source(from.cx(), from.cy());
        l.target(to.cx(), to.cy());
        sd.trim(l, from, to);
        l.startAnimate().pointTo().endAnimate().arrow();
        let t = new sd.Text(l, label).color(C.textBlue);
        l.value(t); t.opacity(0).after(l).startAnimate().opacity(1).endAnimate();
        return l;
    }
    function link(x, y) {
        tr.link(x, y);
        l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
        l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
    }
    return tr;
}