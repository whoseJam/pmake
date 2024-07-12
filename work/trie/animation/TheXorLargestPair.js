import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
let cnt = 1;
let ch = {};
const maxl = 3;
const values = [2, 4, 6, 7]
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const focus = sd.Focus(tree);
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
    const ans = new sd.Array(svg).resize(maxl).cx(tree.cx()).y(tree.my() + 50);
    ans.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let u = 1;
    const links = [];
    focus.startAnimate().focus(1).endAnimate();
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const rev = c === "0" ? "1" : "0";
        const value = (ch[u][rev] ? 1 : 0);
        const next = (ch[u][rev] ? ch[u][rev] : ch[u][c]);
        await sd.pause();
        links.push([u, next]);
        tree.startAnimate().element(u, next).stroke(C.red).strokeWidth(3).endAnimate();
        ans.startAnimate().value(i, value).endAnimate();
        await sd.pause();
        u = next;
        focus.startAnimate().focus(u).endAnimate();
    }
    await sd.pause();
    valueTables.startAnimate().color(C.black).endAnimate();
    focus.startAnimate().focus(null).endAnimate();
    tree.startAnimate();
    tree.color(C.white);
    links.forEach(link => tree.element(link[0], link[1]).stroke(C.black).strokeWidth(1));
    tree.endAnimate();
    ans.startAnimate().opacity(0).endAnimate();

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