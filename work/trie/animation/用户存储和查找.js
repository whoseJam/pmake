import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
let cnt = 1;
let ch = {};
const username = [
    "hello",
    "hi",
    "hella",
    "hill"
]
const tree = new sd.Tree(svg).x(600).y(100).layerHeight(80);
const usernameTables = new sd.Code(svg);
tree.root(1); ch[1] = {};

init();
main();

async function main() {
    await sd.pause();
}

function init() {
    username.forEach(name => insert(name));
    usernameTables.fontSize(30);
    usernameTables.mx(tree.x() - 50).y(tree.y());
    username.forEach(name => usernameTables.push(name));
}

function insert(str) {
    let u = 1;
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (!ch[u][c]) {
            ch[u][c] = makeNode();
            tree.newNode(ch[u][c]);
            tree.newLink(u, ch[u][c], c);
            tree.element(u, ch[u][c]).arrow().rule(
                R.pointAtPathByRate(0.5, "x", "cy")
            );
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