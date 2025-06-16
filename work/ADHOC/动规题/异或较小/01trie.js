import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
let cnt = 1;
let ch = {};
const maxl = 3;
const values = [0, 2, 6, 7, 4, 5];
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
tree.root(1);
ch[1] = {};

sd.init(() => {
    values.forEach(value => insert(numberToString(value)));
});

sd.main(async () => {
    await sd.pause();
    tree.element(1, 7).startAnimate().stroke(C.red).endAnimate();
    tree.element(7, 11).startAnimate().stroke(C.red).endAnimate();
    tree.element(11, 13).startAnimate().stroke(C.red).endAnimate();
});

function insert(str) {
    let u = 1;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (!ch[u][c]) {
            ch[u][c] = makeNode();
            tree.newNode(ch[u][c]);
            if (c === "0") tree.leftChild(u, ch[u][c], c);
            else tree.rightChild(u, ch[u][c], c);
            tree.element(u, ch[u][c]).arrow();
        }
        u = ch[u][c];
    }
    tree.element(u).strokeWidth(4).stroke(C.red);
}

function makeNode() {
    const id = ++cnt;
    ch[id] = {};
    return id;
}

function numberToString(v) {
    let ans = "";
    for (let i = 0; i < maxl; i++) {
        const dir = (v >> i) & 1;
        ans = String(dir) + ans;
    }
    return ans;
}
