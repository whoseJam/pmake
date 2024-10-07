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
    const Q = [1];
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        const children = ac.children(u);
        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]); Q.push(v);
            const character = ac.value(u, v).text();
            let f = ac.element(u).fail;
            while (f && !ac.element(f).acch[character]) {
                f = ac.element(f).fail;
            }
            if (f && ac.element(f).acch[character]) {
                const failOfV = ac.element(f).acch[character];
                link(v, failOfV);
                ac.element(v).fail = failOfV;
            } else {
                link(v, 1);
                ac.element(v).fail = 1;
            }
        }
    }
})

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    ac.forEachNodes((node, id) => {
        if (node.cx() < ac.cx()) {
            sd.Label(node, getString(id), "lc").opacity(0).startAnimate().opacity(1).endAnimate();
        } else {
            sd.Label(node, getString(id), "rc").opacity(0).startAnimate().opacity(1).endAnimate();
        }
    })

    let current = 0;
    ac.forEachNodes((node, id) => {
        node.onClick(() => {
            if (current && current !== id) return;
            sd.inter(async () => {
                const col = current ? C.white : C.green;
                let f = id;
                ac.startAnimate().color(f, col).endAnimate();
                while (ac.element(f).fail) {
                    f = ac.element(f).fail;
                    ac.startAnimate().color(f, col).endAnimate();
                }
                if (current) current = 0;
                else current = id;
            })
        })
    })
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
        .strokeDashArray([5, 5]);
    sd.trim(l, nodeU, nodeV);
    return l;
}

function getString(u) {
    let ans = "";
    while (ac.father(u)) {
        const f = ac.fatherId(u);
        ans = ac.text(f, u) + ans;
        u = f;
    }
    return ans;
}