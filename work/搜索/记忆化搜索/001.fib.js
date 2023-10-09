import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let id = 0;
let highlight = 0;
let f = sd.make1d(10, 0);
let vis = sd.make1d(10, 0);
let farr = sd.Array(svg).resize(10).x(635).y(485).drag(true).resizeable(true);
let visArr = sd.Array(svg).resize(10).x(635).y(550).drag(true).resizeable(true);
let stack = sd.CallStack(svg).x(30).y(30).drag(true).resizeable(true);
let tree = sd.BoxTree(svg).x(545).y(90).layerHeight(90).width(600).drag(true).resizeable(true);
appendArrayIndex(farr); appendArrayName(farr, "f数组")
appendArrayIndex(visArr); appendArrayName(visArr, "vis数组");

let faccode = `
int fib(int n){
    if(n==0||n==1) return 1;
    if(vis[n]) return f[n];
    int a=fib(n-1);
    int b=fib(n-2);
    f[n]=a+b;
    vis[n]=1;
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
    id = 0; vis = sd.make1d(10, 0);
    await fib(5, 0);
}

async function build_fib(n, prt) {
    let me = ++id;
    if (prt) tree.link({ parent: prt, id: me, value: sd.Text(tree, F(n)) });
    if (n === 0 || n === 1) return;
    if (vis[n]) return;
    await build_fib(n - 1, me);
    await build_fib(n - 2, me);
    vis[n] = 1;
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
    stack.code(dep).highlight(1);
    stack.endAnimate();
    await sd.pause();


    stack.startAnimate();
    stack.code(dep).highlight(2);
    stack.endAnimate();
    await sd.pause();

    if (n === 0 || n === 1) {
        stack.startAnimate();
        stack.exit();
        stack.endAnimate();
        return 1;
    }

    stack.startAnimate();
    stack.code().highlight(3);
    stack.endAnimate();
    await sd.pause();

    if (vis[n]) {
        stack.startAnimate();
        stack.exit();
        stack.endAnimate();
        return f[n];
    }

    stack.startAnimate();
    stack.code(dep).highlight(4);
    stack.endAnimate();
    await sd.pause();

    let a = await fib(n - 1, dep + 1, me);

    tree.startAnimate()
        .color(highlight, C.DEFAULT)
        .color(highlight = me, C.GREEN)
        .endAnimate();
    await sd.pause();
    stack.startAnimate();
    stack.code(dep).highlight(5);
    stack.endAnimate();
    await sd.pause();
    let b = await fib(n - 2, dep + 1, me);

    tree.startAnimate()
        .color(highlight, C.DEFAULT)
        .color(highlight = me, C.GREEN)
        .endAnimate();
    await sd.pause();
    stack.startAnimate();
    stack.code().highlight(6, 7);
    stack.endAnimate();
    await sd.pause();

    farr.startAnimate();
    farr.value(n, sd.Text(farr, a + b));
    farr.endAnimate();
    visArr.startAnimate();
    visArr.value(n, sd.Text(visArr, "true"));
    visArr.endAnimate();
    vis[n] = true;
    f[n] = a + b;
    
    await sd.pause();
    stack.startAnimate();
    stack.code(dep).highlight(8);
    stack.endAnimate();
    await sd.pause();

    stack.startAnimate();
    stack.exit();
    stack.endAnimate();
    return a + b;
}

function appendArrayName(array, name) {
    let text = sd.Text(array, name);
    let rule = () => {
        text.mx(array.x() - 10)
            .cy(array.cy());
    }
    array.children.push(text, rule);
    return array;
}

function appendArrayIndex(array) {
    let index = sd.Array(array);
    let l = array.start();
    let r = l + array.length() - 1;
    for (let i = l; i <= r; i++) {
        index.push(i);
        index.element(i - l)
             .background()
             .fillOpacity(0)
             .strokeOpacity(0);
    }
    let rule = () => {
        let h = array.height() / 4;
        index.height(h)
             .width(array.width())
             .x(array.x())
             .my(array.y());
    }
    array.children.push(index, rule);
    return array;
}