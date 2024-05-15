import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let t = makeTree();
global.tree = function() { return t; }

main();

async function main() {
    await sd.pause();
    t.startAnimate();
    await t.dfs1(1, 0);
    t.endAnimate();
    await sd.pause();
    await t.dfs2(1, 1);
    await t.query(6, 11);
}

function makeTree() {
    let h = sd.make1d(100), l = sd.make1d(100), cnt = 0;
    let sz = sd.make1d(100), sn = sd.make1d(100), top = sd.make1d(100);
    let dep = sd.make1d(100), pos = sd.make1d(100), rpos = sd.make1d(100), fa = sd.make1d(100);
    let tr = new sd.Tree(svg).layerHeight(60).width(600).x(50).y(50);
    let arr = new sd.Array(svg).x(550).cy(300).start(1);
    let edges = [
        [1, 2], [2, 3], [3, 4], [3, 5], [4, 6],
        [5, 7], [7, 8], [8, 9], [8, 10], [9, 11],
        [10, 12], [12, 13]
    ];

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
        if (now === 1) arr.startAnimate();
        arr.push(`${now}`);
        top[now] = t; pos[now] = arr.length(); rpos[arr.length()] = now;
        if (sn[now]) await dfs2(sn[now], t);
        for (let i = h[now]; i; i = l[i].nxt) {
            let v = l[i].to;
            if (v !== fa[now] && v !== sn[now]) {
                await dfs2(v, v);
            }
        }
        if (now === 1) arr.endAnimate();
    }
    async function climbOnTree(x, y, label) {
        await sd.pause();
        let fx = top[x], fy = top[y];
        let px = sd.Pointer(tr, "x", "r"), pfx = sd.Pointer(tr, "fx", "r");
        let py = sd.Pointer(tr, "y", "l"), pfy = sd.Pointer(tr, "fy", "l");
        function moveAll() {
            px.startAnimate().moveTo(x).endAnimate(); pfx.startAnimate().moveTo(fx).endAnimate();
            py.startAnimate().moveTo(y).endAnimate(); pfy.startAnimate().moveTo(fy).endAnimate();
        }
        moveAll();
        while (fx !== fy) {
            if (dep[fx] < dep[fy]) {
                await sd.pause();
                let tmp = fx; fx = fy; fy = tmp;
                tmp = x; x = y; y = tmp;
                moveAll();
            }
            await sd.pause();
            markOnTree(x, fx, C.orange);
            markOnSeq(pos[fx], pos[x], C.orange, label);
            let l1 = linkTo(tr.element(fx), arr.element(pos[fx]), "pos[fx]");
            let l2 = linkTo(tr.element(x), arr.element(pos[x]), "pos[x]");
            await sd.pause();
            markOnTree(x, fx, C.white);
            markOnSeq(pos[fx], pos[x], C.white);
            l1.startAnimate().remove();
            l2.startAnimate().remove();
            await sd.pause();
            x = fa[fx]; moveAll();
            await sd.pause();
            fx = top[x]; moveAll();
        }
        await sd.pause();
        pfx.startAnimate().opacity(0).endAnimate();
        pfy.startAnimate().opacity(0).endAnimate();
        if (pos[x] > pos[y]) {
            let tmp = x; x = y; y = tmp;
            await sd.pause();
            moveAll();
        }
        await sd.pause();
        markOnTree(y, x, C.orange);
        markOnSeq(pos[x], pos[y], C.orange, label);
        let l1 = linkTo(tr.element(x), arr.element(pos[x]), "pos[x]");
        let l2 = linkTo(tr.element(y), arr.element(pos[y]), "pos[y]");
        await sd.pause();            
        markOnTree(y, x, C.white);
        markOnSeq(pos[x], pos[y], C.white);
        l1.startAnimate().remove();
        l2.startAnimate().remove();
        await sd.pause();
        px.startAnimate().opacity(0).endAnimate();
        py.startAnimate().opacity(0).endAnimate();
        await sd.pause();
    }
    tr.query = async function(x, y) {
        await climbOnTree(x, y, "Query");
    }
    tr.update = async function(x, y) {
        await climbOnTree(x, y, "Update");
    }
    function markOnTree(x, t, col) {
        tr.startAnimate();
        while (x !== t) { tr.color(x, col); x = tr.father(x); }
        tr.color(x, col);
        tr.endAnimate();
    }
    let brace = new sd.Brace(svg).opacity(0);
    let text = new sd.Text(svg).opacity(0);
    function markOnSeq(l, r, col, label) {
        let el = arr.element(l);
        let er = arr.element(r);
        brace.source(el.x(), arr.y() - 10).target(er.mx(), arr.y() - 10);
        if (col === C.orange) {
            text.text(label).cx(brace.cx()).my(brace.y() - 5);
            brace.opacity(1);
            brace.startAnimate();
            brace.pointTo();
            brace.endAnimate();
            text.opacity(0).after(brace).startAnimate().opacity(1).endAnimate();
        } else {
            text.startAnimate().opacity(0).endAnimate();
            brace.after(text).startAnimate();
            brace.pointToAndFade();
            brace.endAnimate();
        }
        arr.startAnimate().color(l, r, col).endAnimate();
    }
    function linkTo(from, to, label) {
        let l = new sd.Curve(svg);
        l.source(from.cx(), from.cy());
        l.target(to.cx(), to.my());
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