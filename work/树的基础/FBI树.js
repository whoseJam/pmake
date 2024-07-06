import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let t = exprTree();

main();

async function main() {
    await t.build();
    await t.lastOrder(1);
}

function exprTree() {
    let self = {};
    let t = new sd.BinaryTree(svg).width(800).cx(600).y(100);
    let arr = new sd.Array(svg).start(1);
    let expr = "10001011";
    for (let i = 0; i < expr.length; i++) arr.push(expr[i]);
    arr.cx(600).y(400);

    let id = 0;
    function link(x, y, dir, nodev) {
        t.newNode(y, nodev);
        if (dir === 0) t.startAnimate().leftChild(x, y).endAnimate();
        else t.startAnimate().rightChild(x, y).endAnimate();
    }

    async function build(l, r, prt, dir) {
        let has0 = false, has1 = false;
        for(let i = l; i <= r; i++) {
            if(arr.text(i) === "0") has0 = true;
            if(arr.text(i) === "1") has1 = true;
        }
        let mytype;
        if (has0 && has1) mytype = "F";
        else mytype = has0 ? "B": "I";
        let myid = ++id, mid = Math.floor((l + r) / 2);

        await sd.pause();
        arr.startAnimate().color(l, r, C.blue).endAnimate();
        if (!prt) {
            await sd.pause();
            t.startAnimate().root(1, mytype).endAnimate();
        } else {
            await sd.pause();
            link(prt, myid, dir, mytype);
        }
        await sd.pause();
        arr.startAnimate().color(l, r, C.white).endAnimate();

        if (l === r) return;

        await build(l, mid, myid, 0);
        await build(mid+1, r, myid, 1);
    }

    self.build = async function() {
        await build(1, arr.length(), 0, 0);
    }

    let last = new sd.Array(svg).x(600).y(500);

    self.lastOrder = async function dfs(u) {
        await sd.pause();
        t.startAnimate();
        t.color(u, C.GREEN);
        t.endAnimate();
        if (t.leftChild(u)) {
            await dfs(t.leftChild(u));
        }
        if (t.rightChild(u)) {
            await dfs(t.rightChild(u));
        }
        await sd.pause();
        last.startAnimate().push(t.text(u)).cx(600).endAnimate();
        await sd.pause();
        t.startAnimate();
        t.color(u, C.DEFAULT);
        t.endAnimate();
    }


    return self;
}