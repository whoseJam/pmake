import * as sd from "../../../lib/slide";

const rotateCodeStr = `
void rotate(int x,int &f){
    int y=fa[x],z=fa[y],L=(ch[y][0]==x?0:1),R=(L^1);
    if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;fa[x]=z;
    fa[y]=x;
    fa[ch[x][R]]=y;ch[y][L]=ch[x][R];
    ch[x][R]=y;
    pushUp(y);pushUp(x);
}`

let svg = sd.svg();
let C = sd.color();
let s = makeSplay();
global.help = function() {
    return `
此场景中存在一个s对象
s.rotate(x): 对x点进行一次旋转`;
}
global.s = s;

main();

async function main() {
    await s.rotate(3);
}

function makeSplay() {
    let self = {};
    let t = new sd.Splay(svg);
    let rotateCode = new sd.Code(svg).code(rotateCodeStr).opacity(0).cx(600).y(20);
    let root = 4, n = 8;
    let data = [
        [4, 3, 5],
        [3, 1, 0],
        [1, 0, 2],
        [5, 0, 7],
        [7, 6, 8]
    ];
    let fa = sd.make1d(100);
    let ch = sd.make2d(100, 2);
    t.width(1000).y(280).cx(600).root(root);
    for (let i = 0; i < data.length; i++) {
        let cur = data[i][0];
        let lc = data[i][1];
        let rc = data[i][2];
        if (lc) link(cur, lc, 0);
        if (rc) link(cur, rc, 1);
    }
    function link(x, y, flg) {
        fa[y] = x; ch[x][flg] = y;
        if (flg === 0) t.leftChild(x, y);
        else t.rightChild(x, y);
    }
    function remove(x, y) {
        let e = t.element(x, y);
        e.startAnimate().fadeTtoS().endAnimate();
        t.after(e).cut(x, y);
    }
    function appear(elem) {
        return elem.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    t.update();

    function dfs(u, delta) {
        t.element(u)._.recordDepth += delta;
        let children = t.childrenOnTree(u);
        for (let v of children) {
            dfs(v.nodeId, delta);
        }
    }

    self.rotate = async function rotateAnimate(x) {
        t.record();
        await sd.pause();
        rotateCode.startAnimate().opacity(1).endAnimate();
        await sd.pause();
        rotateCode.startAnimate().focus(1).endAnimate();
        await sd.pause();
        rotateCode.startAnimate().focus(2).endAnimate();
        await sd.pause();
        let y = fa[x], z = fa[y], L = (ch[y][0] === x ? 0 : 1), R = L^1;
        let pointToX = appear(sd.Pointer(t, "x", "b").moveTo(x));
        let pointToY = y ? appear(sd.Pointer(t, "y", "b").moveTo(y)) : null;
        let pointToZ = z ? appear(sd.Pointer(t, "z", "b").moveTo(z)) : null;
        if (z === 0) {
            await sd.pause();
            rotateCode.startAnimate().focus(3).endAnimate();
        }
        else if (ch[z][0] === y) {
            await sd.pause();
            rotateCode.startAnimate().focus(3).endAnimate();
            await sd.pause();
            if (ch[z][0]) remove(z, ch[z][0]);
            t.startAnimate().leftChild(z, x).endAnimate();

            ch[z][0] = x;
        } else {
            await sd.pause();
            rotateCode.startAnimate().focus(3).endAnimate();
            await sd.pause();
            if (ch[z][1]) remove(z, ch[z][1]);
            t.startAnimate().rightChild(z, x).endAnimate();
           
            ch[z][1] = x;
        }

        await sd.pause();
        rotateCode.startAnimate().focus(4).endAnimate();
        await sd.pause();
        remove(y, x);
        t.element(x).parentNodeId = z ? z : undefined;
        dfs(x, -1); dfs(y, +1);
        t.startAnimate().update().endAnimate();
        fa[x] = z;
        fa[y] = x;

        await sd.pause();
        rotateCode.startAnimate().focus(5).endAnimate();

        if (ch[x][R]) {
            await sd.pause();
            remove(x, ch[x][R]);
            dfs(ch[x][R], +1);
            t.startAnimate().link(y, ch[x][R], L).endAnimate();
            fa[ch[x][R]] = y;
        }
        ch[y][L] = ch[x][R];

        await sd.pause();
        rotateCode.startAnimate().focus(6).endAnimate();

        await sd.pause();
        t.startAnimate().link(x, y, R).endAnimate();
        ch[x][R] = y;

        await sd.pause();
        rotateCode.startAnimate().focus(7).endAnimate();

        await sd.pause();
        pointToX.startAnimate().opacity(0).remove();
        pointToY?.startAnimate().opacity(0).remove();
        pointToZ?.startAnimate().opacity(0).remove();
        t.startAnimate().record(false).update().endAnimate();
        rotateCode.startAnimate().focus(null).opacity(0).endAnimate();
        await sd.pause();
    }
    
    return self;
}