import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(90).width(600);
const target = "abaa";
const arr = new sd.Array(svg).pushArray(target);
const data = [
    "aba",
    "ba",
    "aa",
    "bb"
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
                ac.element(tot).acch = {};
            }
            u = cur.acch[s[i]];
        }
        ac.element(u).strokeWidth(3);
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

    ac.forEachNodes((node, id) => {
        if (id === "1") return;
        if (node.cx() < ac.father(node).cx() ||
           (node.cx() === ac.father(node).cx() && node.cx() < ac.cx())) {
            sd.Label(node, getString(id), "lc");
        } else {
            sd.Label(node, getString(id), "rc");
        }
    })
    arr.x(ac.mx()).cy(ac.cy());

    ac.forEachNodes((node, id) => {
        let marked = false;
        node.onClick(() => {
            if (marked) return;
            sd.inter(async () => {
                marked = true;
                sd.Aside(node, new sd.Text(node, "已标记").fontSize(10), "rb", -2);
            })
        })
    })
})

sd.main(async () => {
    await sd.pause();
    let u = 1;
    const pointer = sd.Pointer(arr);
    const focusU = sd.Focus(ac).startAnimate().focus(u).endAnimate();
    focusU._.layer.setAttribute("pointer-events", "none");
    const brace = sd.Brace(arr);
    
    for (let i = 0; i < target.length; i++) {
        await sd.pause();
        pointer.startAnimate().moveTo(i).endAnimate();

        const character = target[i];
        while (u && !ac.element(u).acch[character]) {
            u = ac.element(u).fail;
            const length = ac.depth(u) - 1;
            if (u) {
                await sd.pause();
                focusU.startAnimate().focus(u).endAnimate();
                brace.startAnimate().brace(i - length, i - 1).endAnimate();
                arr.startAnimate().color(i, C.orange).endAnimate();
            }
        }
        if (ac.element(u).acch[character]) {
            const length = ac.depth(u) - 2;
            u = ac.element(u).acch[character];
            await sd.pause();
            focusU.startAnimate().focus(u).endAnimate();
            ac.startAnimate().color(u, C.green).endAnimate();
            if (i - length - 1 <= i - 1) brace.startAnimate().brace(i - length - 1, i - 1).endAnimate();
            else brace.startAnimate().opacity(0).endAnimate();
            arr.startAnimate().color(i, C.green).endAnimate();

            await sd.pause();
            ac.startAnimate().color(u, C.white).endAnimate();
            arr.startAnimate().color(i, C.white).endAnimate();
            brace.startAnimate().brace(i - length - 1, i).endAnimate();
        } else {
            u = 1;
            brace.startAnimate().opacity(0).endAnimate();
        }
    }
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