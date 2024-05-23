import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
let cnt = 1;
let ch = {};
const maxl = 3;
const values = [0, 2, 6, 7]
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const valueTables = new sd.Code(svg);
tree.root(1); ch[1] = {};

init();
main();

async function main() {
    for (let i = 1; i <= values.length; i++)
        await query(i);
    await sd.pause();
}

function init() {
    values.forEach(value => insert(numberToString(value)));
    valueTables.fontSize(30);
    valueTables.mx(tree.x() - 50).y(tree.y());
    values.forEach(name => valueTables.push(`${name}:${numberToString(name)}`));
}

function insert(str) {
    let u = 1;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (!ch[u][c]) {
            ch[u][c] = makeNode();
            tree.newNode(ch[u][c]);
            if (c === "0") tree.leftChild(u, ch[u][c], c);
            else tree.rightChild(u, ch[u][c], c);
            tree.element(u, ch[u][c]).arrow().rule(
                R.PointAtPathByRate(0.5, "x", "cy")
            );
        }
        u = ch[u][c];
    }
    tree.element(u).strokeWidth(4).stroke(C.red);
}

async function query(i) {
    await  sd.pause();
    valueTables.startAnimate().color(i, C.deepSkyBlue).endAnimate();
    const str = numberToString(values[i - 1]);
    await sd.pause();
    let u = 1;
    tree.startAnimate().color(u, C.blue);
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        u = ch[u][c];
        tree.color(u, C.blue);
    }
    tree.endAnimate();
    await sd.pause();
    valueTables.startAnimate().color(C.black).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
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