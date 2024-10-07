import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const data = [
    "ababa",
    "babb"
];

ac.root(1);

sd.init(() => {
    let tot = 1;
    function insert(s) {
        let u = 1;
        for (let i = 0; i < s.length; i++) {
            const cur = ac.element(u);
            if (!cur.acch) cur.acch = {};
            if (!cur.acch[s[i]]) {
                cur.acch[s[i]] = ++tot;
                ac.link(u, tot);
                ac.element(u, tot).value(s[i], R.PointAtPathByRate(0.5, "mx", "cy", -5));
            }
            u = cur.acch[s[i]];
        }
    }
    data.forEach(s => insert(s));
    for (let i = 1; i <= tot; i++) {
        ac.element(i).fail = 0;
    }
})

sd.main(async () => {
    await sd.pause();
    const Q = [1];
    const focus = sd.Focus(ac);
    const failFocus = sd.Focus(ac);
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        await sd.pause();
        focus.startAnimate().focus(u).endAnimate();

        const children = ac.children(u);
        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]); Q.push(v);
            await sd.pause();
            ac.startAnimate().color(v, C.blue).endAnimate();

            const character = ac.value(u, v).text();
            let f = ac.element(u).fail;
            while (f && !ac.element(f).acch[character]) {
                await sd.pause();
                failFocus.startAnimate().focus(f).endAnimate();
                f = ac.element(f).fail;
            }
            if (f && ac.element(f).acch[character]) {
                const failOfV = ac.element(f).acch[character];
                const length = ac.depth(failOfV) - 1;
                await sd.pause();
                failFocus.startAnimate().focus(f).endAnimate();
                ac.startAnimate()
                colorPath(getPath(v, length), C.red, 3);
                colorPath(getPath(failOfV, length), C.red, 3);
                ac.color(failOfV, C.orange)
                ac.endAnimate();
                
                await sd.pause();
                link(v, failOfV);

                await sd.pause();
                failFocus.startAnimate().focus(null).endAnimate();
                ac.startAnimate();
                colorPath(getPath(v, length), C.black, 1);
                colorPath(getPath(failOfV, length), C.black, 1);
                ac.color(failOfV, C.white);
                ac.endAnimate();
                ac.element(v).fail = failOfV;
            } else {
                link(v, 1);
                ac.element(v).fail = 1;
            }
            await sd.pause();
            ac.startAnimate().color(v, C.white).endAnimate();
        }
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

function link(u, v) {
    const nodeU = ac.element(u);
    const nodeV = ac.element(v);
    let type = sd.Line;
    if (nodeU.cx() == nodeV.cx() || nodeU.parentNodeId == v || nodeV.parentNodeId == u) type = sd.Curve;
    if (u === 5 && v === 7) type = sd.Curve;
    if (v === 1) type = sd.Curve;
    const l = new type(svg);
    if (u === 5 && v === 7) l.bending(-0.3);
    if (u === 6 && v === 4) l.bending(-0.3);
    if (u === 2) l.bending(-0.3);
    if (u === 7) l.bending(0.3);
    l.source(nodeU.center())
        .target(nodeV.center())
        .arrow()
        .strokeDashArray([5, 5])
        .opacity(0);
    sd.trim(l, nodeU, nodeV);
    l.startAnimate().opacity(1).endAnimate();
    return l;
}

function colorPath(path, color, width) {
    for (let i = 0; i < path.length; i++) {
        ac.element(path[i][0], path[i][1]).stroke(color).strokeWidth(width);
    }
}

function getPath(u, length) {
    const path = [];
    for (let i = 1; i <= length; i++) {
        path.push([ac.fatherId(u), u]);
        u = ac.fatherId(u);
    }
    return path.reverse();
}