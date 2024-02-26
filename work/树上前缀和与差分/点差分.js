import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let t = makeTree();
    global.tree = function() {
        return t;
    }
    await sd.pause();
    t.addPath(2, 3);
    t.addPath(3, 4);
    t.addPath(6, 1);
    // await sd.pause();
    // t.addPath(12, 15);
    await sd.pause();
    t.countSum();
}

function makeTree() {
    let t = new sd.Tree(svg).width(600).cx(600).y(100);
    let n = 6;
    let edges = [[1, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    t.root(1);
    for (let i = 0; i < edges.length; i++)
        t.link(edges[i][0], edges[i][1]);
    for (let i = 1; i <= n; i++) {
        let elem = t.element(i);
        elem.childAs("vars", new sd.VarList(svg).fontSize(15).put("w", 0).put("s", 0), function(parent, child) {
            child.x(parent.mx() + 3).cy(parent.cy());
        });
    }
    function addPath(x, y) {
        let g = t.lca(x, y);
        t.startAnimate();
        t.element(x).child("vars").inc("w");
        t.element(y).child("vars").inc("w");
        t.element(g).child("vars").dec("w");
        let f = t.father(g);
        if (f) t.element(f).child("vars").dec("w");
        t.endAnimate();
    }

    function countSum(x) {
        let ch = t.childrenOnTree(x);
        t.element(x).child("vars").incBy("s", t.element(x).child("vars").get("w"));
        for (let i = 0; i < ch.length; i++) {
            countSum(ch[i]);
            t.element(x).child("vars").incBy("s", t.element(ch[i]).child("vars").get("s"));
        }
    }

    t.addPath = addPath;
    t.countSum = function() {
        t.startAnimate();
        countSum(1);
        t.endAnimate();
    }
    return t;
}