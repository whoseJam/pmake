import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let t = makeBiTree();

main();

async function main() {
    await t.dfs(1);
}

function makeBiTree() {
    let self = {};
    let t = new sd.BinaryTree(svg).root(1).width(600).cx(600).y(100);
    let data = [
        [1, 2, 3],
        [2, 4 ,5],
        [3, 6, 7],
        [4, 8, 9],
        [5, 10, 0]
    ];
    for (let i = 0; i < data.length; i++) {
        let prt = data[i][0], lc = data[i][1], rc = data[i][2];
        if (lc) t.leftChild(prt, lc);
        if (rc) t.rightChild(prt, rc);
    }
    let arr = new sd.Array(svg).x(400).y(400);
    self.dfs = async function dfs(u) {
        await sd.pause();
        t.startAnimate();
        t.color(u, C.GREEN);
        t.endAnimate();
        if (t.leftChild(u)) {
            await dfs(t.leftChild(u));
        }
        await sd.pause();
        arr.startAnimate().push(u).endAnimate();
        if (t.rightChild(u)) {
            await dfs(t.rightChild(u));
        }
        await sd.pause();
        t.startAnimate();
        t.color(u, C.DEFAULT);
        t.endAnimate();
    }
    return self;
}