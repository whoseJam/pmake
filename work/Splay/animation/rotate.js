import * as sd from "@/sd";

const rotateCodeStr = `
void rotate(int x,int &f){
    int y=fa[x],z=fa[y],L=(ch[y][0]==x?0:1),R=(L^1);
    if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;fa[x]=z;
    fa[y]=x;
    fa[ch[x][R]]=y;ch[y][L]=ch[x][R];
    ch[x][R]=y;
    pushUp(y);pushUp(x);
}`
const root = 2;
const n = 9;
const data = [
    [2, 1, 4],
    [4, 3, 8],
    [8, 6, 9],
    [6, 5, 7]
];
const fa = sd.make1d(100);
const ch = sd.make2d(100, 2);

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Splay(svg);
const px = sd.Pointer(tree, "x", "b");
const py = sd.Pointer(tree, "y", "b");
const pz = sd.Pointer(tree, "z", "b");
let isInteracting = false;

init();
main();

async function main() {
    await sd.pause();
}

function init() {
    tree.width(800).cx(600).y(200).root(root);
    for (let i = 0; i < data.length; i++) {
        let cur = data[i][0];
        let lc = data[i][1];
        let rc = data[i][2];
        if (lc) link(cur, lc, 0);
        if (rc) link(cur, rc, 1);
    }
    function link(x, y, flg) {
        fa[y] = x; ch[x][flg] = y;
        if (flg === 0) tree.leftChild(x, y);
        else tree.rightChild(x, y);
    }
    
    for (let i = 1; i <= n; i++) {
        tree.element(i).onClick(() => {
            if (isInteracting) {
                return;
            }
            isInteracting = true;
            rotate(i);
        })
    }
}

async function rotate(x) {
    await sd.pause();
    const y = fa[x], z = fa[y];
    const L = (ch[y][0] === x) ? 0 : 1;
    const R = L^1;
    px.startAnimate().moveTo(x).endAnimate();
    py.startAnimate().moveTo(y).endAnimate();
    if (z) pz.startAnimate().moveTo(z).endAnimate();
    
    await sd.pause();
    
    tree.startAnimate().freeze();
    if (z) tree.cut(z, y);
    tree.cut(y, x);
    if (ch[x][R]) tree.cut(x, ch[x][R]);
    tree.unfreeze().endAnimate();

    await sd.pause();
    tree.startAnimate().freeze();
    if (z) {
        if (ch[z][0] === y) tree.leftChild(z, x);
        else tree.rightChild(z, x);
    }
    if (R === 0) tree.leftChild(x, y);
    else tree.rightChild(x, y);
    if (ch[x][R]) {
        if (R === 1) tree.leftChild(y, ch[x][R]);
        else tree.rightChild(y, ch[x][R]);
    }
    tree.unfreeze().endAnimate();

    await sd.pause();
    px.startAnimate().moveTo(null).endAnimate();
    py.startAnimate().moveTo(null).endAnimate();
    pz.startAnimate().moveTo(null).endAnimate();

    isInteracting = false;

    if (z) {
        if (ch[z][0] === y) ch[z][0] = x;
        else ch[z][1] = x;
    }
    fa[x] = z; fa[y] = x; fa[ch[x][R]] = y;
    ch[y][L] = ch[x][R]; ch[x][R] = y;
}
