import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();

let id = 0;
let highlight = 0;
let stack = sd.CallStack(svg).drag(true).resizeable(true).x(30).y(30);
let tree = sd.BoxTree(svg).x(545).y(90).layerHeight(90).drag(true).resizeable(true).width(600);
let faccode = `
int fib(int n){
    if(n==0||n==1) return 1;
    int a=fib(n-1);
    int b=fib(n-2);
    return a+b;
}`;

main();

function F(n) {
    return `fib(${n})`;
}

async function main() {
    id = 0;
    tree.root({ id: 1, value: sd.Text(tree, F(5)) });
    await build_fib(5);
    tree.opacity(0);
    id = 0;
    await fib(5, 0);
}

async function build_fib(n, prt) {
    let me = ++id;
    if (prt) tree.link({ parent: prt, id: me, value: sd.Text(tree, F(n)) });
    if (n === 0 || n === 1) return;
    await build_fib(n - 1, me);
    await build_fib(n - 2, me);
}

async function fib(n, dep, prt) {
    let me = ++id; 
    tree.startAnimate()
        .opacity(me, 1);
    if (prt) tree.opacity(prt, me, 1);
    if (highlight > 0) tree.color(highlight, C.DEFAULT);
    tree.color(highlight = me, C.GREEN)
        .endAnimate();

    stack.startAnimate();
    stack.enter({args: [{name: "n", value: n}], name: "fib"}, faccode);
    stack.code(dep).highlight(1, 1);
    stack.endAnimate();
    await sd.pause();


    stack.startAnimate();
    stack.code(dep).highlight(2, 2);
    stack.endAnimate();
    await sd.pause();

    if (n === 0 || n === 1) {
        stack.startAnimate();
        stack.exit();
        stack.endAnimate();
        return 1;
    }

    stack.startAnimate();
    stack.code(dep).highlight(3, 3);
    stack.endAnimate();
    await sd.pause();
    let a = await fib(n - 1, dep + 1, me);

    tree.startAnimate()
        .color(highlight, C.DEFAULT)
        .color(highlight = me, C.GREEN)
        .endAnimate();
    await sd.pause();
    stack.startAnimate();
    stack.code(dep).highlight(4, 4);
    stack.endAnimate();
    await sd.pause();
    let b = await fib(n - 2, dep + 1, me);

    tree.startAnimate()
        .color(highlight, C.DEFAULT)
        .color(highlight = me, C.GREEN)
        .endAnimate();
    await sd.pause();
    stack.startAnimate();
    stack.code(dep).highlight(5, 5);
    stack.endAnimate();
    await sd.pause();

    stack.startAnimate();
    stack.exit();
    stack.endAnimate();
    return a + b;
}