import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let t = makeTree();
    global.tree = function() {
        return t;
    }
    await sd.pause();
    t.addPath(12, 15);
    await sd.pause();
    t.countSum();
}

function makeTree() {
    let t = new sd.Tree(svg).width(1100).cx(600).y(100);
    let n = 20;
    let edges = [
        [1, 2], [1, 3], [1, 4],
        [2, 5], [2, 6],
        [4, 7], [4, 8],
        [5, 9], [5, 10],
        [6, 11], [7, 12], [8, 13], [8, 14], [8, 15],
        [10, 16], [12, 17], [14, 18], [15, 19], [15, 20]
    ];
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
        t.element(x).child("vars").inc("w").color("w", C.red);
        t.element(y).child("vars").inc("w").color("w", C.red);
        t.element(g).child("vars").dec("w").dec("w").color("w", C.red);
        t.endAnimate();
    }

    function countSum(x) {
        let ch = t.childrenOnTree(x);
        t.element(x).child("vars").incBy("s", t.element(x).child("vars").get("w"));
        for (let i = 0; i < ch.length; i++) {
            countSum(ch[i]);
            t.element(x).child("vars").incBy("s", t.element(ch[i]).child("vars").get("s"));
            if (t.element(x).child("vars").get("s") !== 0)
                t.element(x).child("vars").color("s", "#24b7ff"); 
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