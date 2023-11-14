import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let t = sd.BinaryTree(svg);
let root = 5;
let fa = sd.make1d(100);
let ch = sd.make2d(100, 2);
t.root(root);
for (let i = root; i > 1; i--) link(i, i-1, 0);
for (let i = root; i < root*2; i++) link(i, i+1, 1);
t.x(0).y(100).width(1200);
for (let i = 1; i <= 10; i++) {
    t.element(i).onclick(function() {
        Splay(i);
    })
}

function link(x, y, flg) {
    t.link(x, y, flg);
    fa[y] = x;
    ch[x][flg] = y;
}

function rotate(x) {
    let cuts = [], links = [];
    let y = fa[x], z = fa[y], L = (ch[y][0] === x ? 0 : 1), R = L^1, flg = null;
    if (y === root) root = x;
    else if (ch[z][0] === y) {
        if (ch[z][0]) cuts.push(t.cut.bind(t, z, ch[z][0]));
        ch[z][0] = x; flg = 0;
    } else {
        if (ch[z][1]) cuts.push(t.cut.bind(t, z, ch[z][1]));
        ch[z][1] = x; flg = 1;
    }
    let chxR = ch[x][R];
    fa[x] = z; fa[y] = x; fa[ch[x][R]] = y;
    ch[y][L] = ch[x][R]; ch[x][R] = y;
    cuts.push(t.cut.bind(t, y, x));
    if (chxR) {
        cuts.push(t.cut.bind(t, x, chxR));
        links.push(t.link.bind(t, y, chxR, L));
    }
    if (z && flg !== null) links.push(t.link.bind(t, z, x, flg));
    links.push(t.link.bind(t, x, y, R));
    
    t.startAnimate();
    for (let i = 0; i < cuts.length; i++) cuts[i]();
    t.endAnimate();
    t.startAnimate();
    for (let i = 0; i < links.length; i++) links[i]();
    t.endAnimate();
}

async function Splay(x) {
    await sd.pause();
    t.startAnimate().color(x, C.green).endAnimate();
    while (x !== root) {
        let y = fa[x], z = fa[y];
        if (z) {
            await sd.pause();
            if ((ch[z][0] === y) ^ (ch[y][0] === x)) rotate(x);
            else rotate(y);
        }
        await sd.pause();
        rotate(x);
    }
    await sd.pause();
    t.startAnimate().color(x, C.white).endAnimate();
}
