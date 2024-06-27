import * as sd from "@/SD";

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
const focus = sd.Focus(tree);
const usernameTables = new sd.Code(svg);
tree.root(1); ch[1] = {};

init();
main();

async function main() {
    for (let i = 0; i < username.length; i++)
        await insert(username[i]);
    await sd.pause();
}

function init() {
    usernameTables.fontSize(30);
    usernameTables.mx(tree.x() - 50).y(tree.y());
    username.forEach(name => usernameTables.push(name));
}

async function insert(str) {
    await sd.pause();
    const arr = new sd.Array(svg);
    arr.x(usernameTables.x()).my(usernameTables.y() - 30);
    arr.pushArray(str).opacity(0).startAnimate().opacity(1).endAnimate();
    const pointer = sd.Pointer(arr, "i", "b");
    
    let u = 1;
    focus.startAnimate().focus(1).endAnimate();
    for (let i = 0; i < str.length; i++) {
        await sd.pause();
        pointer.startAnimate().moveTo(i).endAnimate();

        let c = str[i];
        if (!ch[u][c]) {
            ch[u][c] = makeNode();
            await sd.pause();
            tree.startAnimate();
            tree.newNode(ch[u][c]);
            tree.newLink(u, ch[u][c], c);
            tree.element(u, ch[u][c]).arrow().rule(
                R.PointAtPathByRate(0.5, "x", "cy")
            );
            tree.endAnimate();
        }
        await sd.pause();
        u = ch[u][c];
        focus.startAnimate().focus(u).endAnimate();
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
    tree.startAnimate();
    tree.element(u).strokeWidth(4).stroke(C.red);
    tree.endAnimate();
    await sd.pause();
    arr.startAnimate().opacity(0).remove();
}

function makeNode() {
    const id = ++cnt;
    ch[id] = {};
    return id;
}