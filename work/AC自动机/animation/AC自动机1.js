import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const data = [
    "aba",
    "bab"
];

ac.root(1);

init();
main();

function init() {
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
        ac.element(u).stroke(C.red).strokeWidth(3);
    }
    data.forEach(s => insert(s));
    for (let i = 1; i <= tot; i++) {
        ac.element(i).fail = 0;
    }
}

async function main() {
    await sd.pause();
    const Q = [1];
    const focus = sd.Focus(ac);
    const failFocus = sd.Focus(ac);
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        await sd.pause();
        focus.startAnimate().focus(u).endAnimate();

        const children = ac.childrenOnTree(u);
        for (let i = 0; i < children.length; i++) {
            const v = children[i].nodeId; Q.push(v);
            await sd.pause();
            ac.startAnimate().color(v, C.blue).endAnimate();

            const character = ac.value(u, v).text();
            let f = ac.element(u).fail;
            while (f && !ac.element(f).acch[character]) {
                f = ac.element(f).fail;
            }
            if (f && ac.element(f).acch[character]) {
                const failOfV = ac.element(f).acch[character];
                await sd.pause();
                failFocus.startAnimate().focus(f).endAnimate();
                ac.startAnimate().color(failOfV, C.orange).endAnimate();
                await sd.pause();
                link(v, failOfV);
                await sd.pause();
                failFocus.startAnimate().focus(null).endAnimate();
                ac.startAnimate().color(failOfV, C.white).endAnimate();
                ac.element(v).fail = failOfV;
            } else {
                ac.element(v).fail = 1;
            }
            await sd.pause();
            ac.startAnimate().color(v, C.white).endAnimate();
        }
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
    await sd.pause();
}

function link(u, v) {
    u = ac.element(u);
    v = ac.element(v);
    const l = new sd.Line(svg);
    l.source(u.center())
        .target(v.center())
        .arrow()
        .strokeDashArray([5, 5])
        .opacity(0);
    sd.trim(l, u, v);
    l.startAnimate().opacity(1).endAnimate();
    return l;
}