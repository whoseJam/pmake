import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let Rule = sd.rule();
let cnt = 1;
let ch = {};
let strs = [
    "hello",
    "hi",
    "hella",
    "hill"
]
let tr = sd.Tree(svg).x(600).y(100).layerHeight(80);
tr.root(1); ch[1] = {};

main();

async function main() {
    for (let i = 0; i < strs.length; i++) {
        await insert(strs[i]);
    }
}

async function insert(str) {
    await sd.pause();
    let arr = sd.Array(svg);
    arr.x(100).y(400);
    for (let i = 0; i < str.length; i++)
        arr.push(str[i]);
    arr.opacity(0).startAnimate().opacity(1).endAnimate();
    sd.EnableArrayPointer(arr);
    arr.makePointer("i", 0);
    arr.movePointer("i", 0);

    let u = 1;
    await sd.pause();
    tr.startAnimate();
    tr.color(1, C.green);
    tr.endAnimate();
    for (let i = 0; i < str.length; i++) {
        if (i > 0) {
            await sd.pause();
            arr.startAnimate();
            arr.movePointer("i", i);
            arr.endAnimate();
        }
        
        let c = str[i];
        if (!ch[u][c]) {
            ch[u][c] = makeNode();
            await sd.pause();
            tr.startAnimate();
            tr.newNode(ch[u][c]);
            tr.newLink(u, ch[u][c], c);
            tr.element(u, ch[u][c]).arrow().valueRule(
                Rule.PointAtPathByRate(0.5, "x", "cy")
            );
            tr.endAnimate();
        }
        let lstU = u;
        u = ch[u][c];
        await sd.pause();
        tr.startAnimate();
        tr.color(lstU, C.white);
        tr.color(u, C.green);
        tr.endAnimate();
    }
    await sd.pause();
    tr.startAnimate();
    tr.color(u, C.white);
    tr.element(u).strokeWidth(4).stroke(C.red);
    tr.endAnimate();

    await sd.pause();
    arr.startAnimate().opacity(0).remove();

}

function makeNode() {
    let id = ++cnt;
    ch[id] = {};
    return id;
}