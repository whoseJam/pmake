import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();

普通二维数组存边造成空间浪费();

async function 普通二维数组存边造成空间浪费() {
    function getRandomInt(l, r) {
        return Math.floor(Math.random() * (r - l + 1)) + l;
    }
    
    let n = 9;
    let t = new sd.Tree(svg).x(700).y(100);
    let g = new sd.Grid(svg), cnt = sd.make1d(20);
    g.n(n).m(n).startN(1).startM(1).x(100).y(100);
    t.root(1);
    sd.Index(g, "l");
    sd.Index(g, "t");
    for (let i = 2; i <= n; i++) {
        let f = getRandomInt(1, i - 1);
        cnt[f]++;
        g.value(f, cnt[f], i);
        t.link(f, i);
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (cnt[i] >= j) g.color(i, j, C.blue);
            else g.color(i, j, C.grey);
        }
    }
}

async function 线性数据结构() {
    let arr = new sd.Array(svg);
    let stk = new sd.Stack(svg);
    for (let i = 1; i <= 10; i++) {
        arr.push(Math.floor(Math.random() * 9));
        stk.push(Math.floor(Math.random() * 9));
    }
    arr.x(100).y(100);
    stk.x(700).y(100);
}

async function 树的构建() {
    let t = new sd.BinaryTree(svg).x(100).y(100).width(500);
    t.root(1); t.value(1, "d");
    t.link(1, 2, 0); t.value(2, "c");
    t.link(1, 3, 1); t.value(3, ".");
    t.link(2, 4, 0); t.value(4, "a");
    t.link(2, 5, 1); t.value(5, "b");
    t.link(4, 6, 0); t.value(6, ".");
    t.link(4, 7, 1); t.value(7, ".");
    t.link(5, 8, 0); t.value(8, ".");
    t.link(5, 9, 1); t.value(9, ".");
}

async function 表达式树() {
    let t = new sd.Tree(svg).x(100).y(100).width(500);
    t.root(1); t.value(1, "-");
    t.link(1, 2); t.value(2, "+");
    t.link(1, 3); t.value(3, "/");
    t.link(2, 4); t.value(4, "a");
    t.link(2, 5); t.value(5, "*");
    t.link(3, 6); t.value(6, "e");
    t.link(3, 7); t.value(7, "f");
    t.link(5, 8); t.value(8, "b");
    t.link(5, 9); t.value(9, "-");
    t.link(9, 10); t.value(10, "c");
    t.link(9, 11); t.value(11, "d");
}

async function 树() {
    let t = new sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);
    t.root(1);
    link(1, 2);
    link(1, 3);
    link(2, 4);
    link(3, 5);
    link(3, 6);
    link(4, 7);
    link(4, 8);
    link(4, 9);
    link(5, 10);
    link(5, 11);
    t.cut(1, 2);
    t.cut(1, 3);
    function link(u, v) {
        t.newNode(v);
        t.newLink(u, v);
    }
}