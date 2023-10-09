import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let cur;

let stack = sd.CallStack(svg).drag(true).resizeable(true).x(200).y(50).fontSize(40).width(450);
let tree = sd.BoxTree(svg).x(700).y(50).layerHeight(65).drag(true).resizeable(true)
let faccode = `
int fac(int n){
    if(n==0) return 1;
    int ans=fac(n-1);
    return ans*n;
}`;

main();

function F(n) {
    return `fac(${n})`;
}

async function main() {
    await fac(5, 0);
}

async function fac(n, dep) {
    tree.startAnimate()
    if (dep === 0)
        tree.root({ id: F(n), value: sd.Text(tree, F(n)) })
    if (cur) tree.color(cur, C.DEFAULT);
    tree.color(cur = F(n), C.GREEN);
    tree.endAnimate();

    stack.startAnimate();
    stack.enter({args:[{name: "n", value: n}], name: "fac"}, faccode);
    stack.code(dep).highlight(1, 1);
    stack.endAnimate();
    await sd.pause();


    stack.startAnimate();
    stack.code(dep).highlight(2, 2);
    stack.endAnimate();
    await sd.pause();

    if (n === 0) {
        stack.startAnimate();
        stack.exit();
        stack.endAnimate();
        return 1;
    }

    stack.startAnimate();
    stack.code(dep).highlight(3, 3);
    stack.endAnimate();
    await sd.pause();
    
    tree.startAnimate()
    tree.link({ parent: F(n), id: F(n - 1), value: sd.Text(tree, F(n - 1)) })
    tree.color(cur, C.DEFAULT);
    tree.color(cur = F(n - 1), C.GREEN);
    tree.endAnimate();
    let ans = await fac(n - 1, dep + 1);

    tree.startAnimate();
    tree.color(cur, C.DEFAULT);
    tree.color(cur = F(n), C.GREEN);
    tree.endAnimate();
    await sd.pause();

    stack.startAnimate();
    stack.code(dep).highlight(4, 4);
    stack.endAnimate();
    await sd.pause();

    stack.startAnimate();
    stack.exit();
    stack.endAnimate();
    return ans * n;
}