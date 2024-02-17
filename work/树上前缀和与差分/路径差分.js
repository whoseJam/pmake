import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    let t = makeTree();
    global.tree = function() {
        return t;
    }
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
}