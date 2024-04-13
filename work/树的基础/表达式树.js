import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let t = exprTree();

main();

async function main() {
    await t.build();
    await t.firstOrder(1);
    await t.lastOrder(1);
}

function exprTree() {
    let self = {};
    let t = new sd.BinaryTree(svg).width(800).cx(600).y(100);
    let arr = new sd.Array(svg).start(1);
    let expr = "a+b*(c-d)-e/f";
    for (let i = 0; i < expr.length; i++) arr.push(expr[i]);
    arr.cx(600).y(400);

    let id = 0;
    function link(x, y, dir, nodev) {
        t.newNode(y, nodev);
        if (dir === 0) t.startAnimate().leftChild(x, y).endAnimate();
        else t.startAnimate().rightChild(x, y).endAnimate();
    }

    async function build(l, r, prt, dir) {
        if (l === r) {
            await sd.pause();
            arr.startAnimate().color(l, C.grey).endAnimate();
            await sd.pause();
            let myid = ++id;
            link(prt, myid, dir, arr.text(l));
            return;
        }
        
        let top = 0, op1 = -1, op2 = -1;
        for (let i = l; i <= r; i++) {
            let cur = arr.text(i);
            if (cur === "(") top++;
            if (cur === ")") top--;
            if (top === 0 && (cur === "+" || cur === "-")) op1 = i;
            if (top === 0 && (cur === "*" || cur === "/")) op2 = i;
        }
        if (op1 === -1 && op2 === -1) {
            await sd.pause();
            arr.startAnimate().color(l, C.grey).color(r, C.grey).endAnimate();
            await build(l+1, r-1, prt, dir);
            return;
        }
        let myid = ++id, op = (op1 === -1 ? op2 : op1);
        await sd.pause();
        arr.startAnimate().color(op, C.blue).endAnimate();
        if (!prt) {
            await sd.pause();
            t.startAnimate().root(1, arr.text(op)).endAnimate();
        } else {
            await sd.pause();
            link(prt, myid, dir, arr.text(op));
        }
        await sd.pause();
        arr.startAnimate().color(op, C.grey).endAnimate();

        await build(l, op-1, myid, 0);
        await build(op+1, r, myid, 1);
    }

    self.build = async function() {
        await build(1, arr.length(), 0, 0);
    }

    let first = new sd.Array(svg).x(arr.x()).y(450);
    let last = new sd.Array(svg).x(arr.x()).y(500);

    self.firstOrder = async function dfs(u) {
        await sd.pause();
        t.startAnimate();
        t.color(u, C.GREEN);
        t.endAnimate();
        await sd.pause();
        first.startAnimate().push(t.text(u)).endAnimate();
        if (t.leftChild(u)) {
            await dfs(t.leftChild(u));
        }
        if (t.rightChild(u)) {
            await dfs(t.rightChild(u));
        }
        await sd.pause();
        t.startAnimate();
        t.color(u, C.DEFAULT);
        t.endAnimate();
    }
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
        last.startAnimate().push(t.text(u)).endAnimate();
        await sd.pause();
        t.startAnimate();
        t.color(u, C.DEFAULT);
        t.endAnimate();
    }


    return self;
}