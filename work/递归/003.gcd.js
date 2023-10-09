import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let id = 0;
let highlight = 0;
let A = 720;
let B = 480;
let stack = sd.CallStack(svg).drag(true).resizeable(true).x(40).y(30).width(450);
let tree = sd.BoxTree(svg).x(500).y(50).drag(true).resizeable(true).layerHeight(100);
tree.nodeHeight(40).nodeWidth(200);
let gcdcode = `
int gcd(int a,int b){
    if(b==0)return a;
    int ans=gcd(b,a%b);
    return ans;
}`;

main();

function F(a, b) {
    return `gcd(${a},${b})`;
}

async function main() {
    id = 0;
    tree.root({ id: 1, value: sd.Text(tree, F(A, B) )});
    await buildGcd(A, B);
    tree.opacity(0);
    id = 0;
    await gcd(A, B, 0);
}

async function buildGcd(a, b, prt) {
    let me = ++id;
    if (prt) tree.link({ parent: prt, id: me, value: sd.Text(tree, F(a, b)) });
    if (b === 0) return;
    await buildGcd(b, a%b, me);
}

async function gcd(a, b, dep, prt) {
    let me = ++id; 
    tree.startAnimate()
        .opacity(me, 1);
    if (prt) tree.opacity(prt, me, 1);
    if (highlight > 0) tree.color(highlight, C.DEFAULT);
    tree.color(highlight = me, C.GREEN)
        .endAnimate();

    stack.startAnimate();
    stack.enter({
        args: [{name: "a", value: a}, {name: "b", value: b}], 
        name: "gcd"}, gcdcode);
    stack.code(dep).highlight(1);
    stack.endAnimate();
    await sd.pause();


    stack.startAnimate();
    stack.code(dep).highlight(2);
    stack.endAnimate();
    await sd.pause();

    if (b === 0) {
        stack.startAnimate();
        stack.exit();
        stack.endAnimate();
        return a;
    }

    stack.startAnimate();
    stack.code(dep).highlight(3);
    stack.endAnimate();
    await sd.pause();
    let ans = await gcd(b, a%b, dep+1, me);

    tree.startAnimate()
        .color(highlight, C.DEFAULT)
        .color(highlight = me, C.GREEN)
        .endAnimate();
    await sd.pause();
    
    stack.startAnimate();
    stack.code(dep).highlight(4);
    stack.endAnimate();
    await sd.pause();

    stack.startAnimate();
    stack.exit();
    stack.endAnimate();
    return ans;
}