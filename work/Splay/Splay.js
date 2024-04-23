import * as sd from "../../lib/slide";

const splayCodeStr = `
void splay(int x,int &f){
    while(x!=f){
        int y=fa[x],z=fa[y];
        if(y!=f){
            if((ch[z][0]==y)^(ch[y][x]==x))rotate(x,f);
            else rotate(y,f);
        }
        rotate(x,f);
    }
}`

let svg = sd.svg();
let C = sd.color();
let t = makeSplay();

main();

async function main() {
    await t.rotate(7);
}

function makeSplay() {
    let self = {};
    let t = new sd.BinaryTree(svg);
    t._.makeLink = function() {
        return new sd.Curve(t).bending(0.1);
    }
    let rotateCode = new sd.Code(svg).code(rotateCodeStr).opacity(0).x(10).y(10);
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
    t.x(0).y(200).width(1200).root(root);
    for (let i = 0; i < data.length; i++) {
        let cur = data[i][0];
        let lc = data[i][1];
        let rc = data[i][2];
        if (lc) link(cur, lc, 0);
        if (rc) link(cur, rc, 1);
    }
    for (let i = 0; i < data.length; i++) {
        let cur = data[i][0];
        if (cur === root) t.element(cur).parentNodeId = undefined;
        let lc = data[i][1];
        let rc = data[i][2];
        if (lc) t.element(lc).parentNodeId = cur;
        if (rc) t.element(rc).parentNodeId = cur;
    }
    t.update();
    function link(x, y, flg) {
        fa[y] = x;
        ch[x][flg] = y;
        t.newNode(y);
        t.element(y).dir = flg;
        let e1 = t._.makeLink(t).arrow();
        t.newLinkByTreeBase(x, y, e1);
        let e2 = t._.makeLink(t).arrow().stroke(C.red);
        t.newLinkByTreeBase(y, x, e2);
    }
    function remove(x, y) {
        let e = t.element(x, y);
        e.arrow(false).startAnimate().fadeTtoS().endAnimate();
        t.eraseLinkByTreeBase(x, y);
    }
    function appear(elem) {
        elem.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    function linkChild(x, y) {
        let e = t._.makeLink(t).bending(0.5);
        let t1 = t.element(x);
        let t2 = t.element(y); t2.parentNodeId = y;
        e.source(t1.cx(), t1.cy()).target(t2.cx(), t2.cy());
        sd.trim(e, t1, t2);
        e.startAnimate().pointStoT().endAnimate().arrow();
        t.newLinkByTreeBase(x, y, e);
    }
    function linkFa(x, y) {
        let e = t._.makeLink(t).bending(0.5).stroke(C.red);
        let t1 = t.element(x); t1.parentNodeId = y;
        let t2 = t.element(y);
        e.source(t1.cx(), t1.cy()).target(t2.cx(), t2.cy());
        sd.trim(e, t1, t2);
        e.startAnimate().pointStoT().endAnimate().arrow();
        t.newLinkByTreeBase(x, y, e);
    }
    function construct() {
        for (let i = 1; i <= n; i++) {
            if (!fa[i]) t.element(i).parentNodeId = undefined;
            else t.element(i).parentNodeId = fa[i];
        }
    }

    self.rotate = async function rotateAnimate(x, rt) {
        await sd.pause();
        rotateCode.startAnimate().opacity(1).endAnimate();
        await sd.pause();
        rotateCode.startAnimate().focus(1).endAnimate();
        await sd.pause();
        rotateCode.startAnimate().focus(2).endAnimate();
        await sd.pause();
        let y = fa[x], z = fa[y], L = (ch[y][0] === x ? 0 : 1), R = L^1, flg = null;
        let pointToX = appear(sd.Pointer(t, "x", "b").moveTo(x));
        let pointToY = appear(sd.Pointer(t, "y", "b").moveTo(y));
        let pointToRt = appear(sd.Pointer(t, "z", "b").moveTo(z));
        if (y === rt) {
            await sd.pause();
            rotateCode.startAnimate().focus(3).endAnimate();
            await sd.pause();
            pointToRt.startAnimate().moveTo(x).endAnimate();
            rt = x;
        }
        else if (ch[z][0] === y) {
            await sd.pause();
            rotateCode.startAnimate().focus(4).endAnimate();
            await sd.pause();
            if (ch[z][0]) remove(z, ch[z][0]);
            linkChild(z, x);

            ch[z][0] = x;
        } else {
            await sd.pause();
            rotateCode.startAnimate().focus(5).endAnimate();
            await sd.pause();
            if (ch[z][1]) remove(z, ch[z][1]);
            linkChild(z, x);
           
            ch[z][1] = x;
        }

        await sd.pause();
        rotateCode.startAnimate().focus(6).endAnimate();
        await sd.pause();
        remove(x, y);
        linkFa(x, z);
        fa[x] = z;
        
        await sd.pause();
        remove(y, z);
        linkFa(y, x);
        fa[y] = x;
        
        if (ch[x][R]) {
            await sd.pause();
            remove(ch[x][R], x);
            linkFa(ch[x][R], y);
            fa[ch[x][R]] = y;
        }

        await sd.pause();
        rotateCode.startAnimate().focus(7).endAnimate();

        if (ch[x][R]) {
            await sd.pause();
            linkChild(y, ch[x][R]);
            ch[y][L] = ch[x][R];
        }

        await sd.pause();
        remove(x, ch[x][R]);
        linkChild(x, y);
        ch[x][R] = y;

        await sd.pause();
        rotateCode.startAnimate().focus(8).endAnimate();
        t.startAnimate()
        construct();
        for (let link of t._.links) link.bending(0.1);
        t.update();
        t.endAnimate();
    }

    function rotate(x) {
        let cuts = [], links = [];
        let y = fa[x], z = fa[y], L = (ch[y][0] === x ? 0 : 1), R = L^1, flg = null;
        if (y === root) root = x;
        else if (ch[z][0] === y) {
            if (ch[z][0]) cuts.push(t.cut.bind(t, z, ch[z][0]));
            ch[z][0] = x; flg = 0;
        } else {
            if (ch[z][1]) cuts.push(t.cut.bind(t, z, ch[z][1]));
            ch[z][1] = x; flg = 1;
        }
        let chxR = ch[x][R];
        fa[x] = z; fa[y] = x; fa[ch[x][R]] = y;
        ch[y][L] = ch[x][R]; ch[x][R] = y;
        cuts.push(t.cut.bind(t, y, x));
        if (chxR) {
            cuts.push(t.cut.bind(t, x, chxR));
            links.push(t.link.bind(t, y, chxR, L));
        }
        if (z && flg !== null) links.push(t.link.bind(t, z, x, flg));
        links.push(t.link.bind(t, x, y, R));
        
        t.startAnimate();
        for (let i = 0; i < cuts.length; i++) cuts[i]();
        t.endAnimate();
        t.startAnimate();
        for (let i = 0; i < links.length; i++) links[i]();
        t.endAnimate();
    }
    
    self.splay = async function Splay(x) {
        await sd.pause();
        t.startAnimate().color(x, C.green).endAnimate();
        while (x !== root) {
            let y = fa[x], z = fa[y];
            if (z) {
                await sd.pause();
                if ((ch[z][0] === y) ^ (ch[y][0] === x)) rotate(x);
                else rotate(y);
            }
            await sd.pause();
            rotate(x);
        }
        await sd.pause();
        t.startAnimate().color(x, C.white).endAnimate();
    }
    
    return self;
}