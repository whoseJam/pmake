import * as sd from "#lib/slide";


let svg = sd.svg();
let C = sd.color();
let R = sd.rule();

const make1d = (len) => {
    let ans = [];
    for (let i = 0; i < len; i++)
        ans.push(0);
    return ans;
}

const getFa = (x) => {
    if (fa[x] === x) return x;
    let ans = getFa(fa[x]);
    return ans;
}

let g = sd.Graph(svg);
let fa = make1d(100);
let n = 6;
let board = sd.Text(svg);

for (let i = 1; i <= n; i++) {
    fa[i] = i;
    g.newNode(i);
}
g.cx(200);
g.cy(300);
board.x(500);
board.y(300);
board.fontSize(40);

let lines = [
    [1, 2, 4],
    [2, 4, 2],
    [1, 6, 6],
    [4, 1, 5],
    [5, 6, 3],
    [2, 5, 1],
    [3, 5, 7]
];

for (let i = 0; i < lines.length; i++) {
    let x = lines[i][0];
    let y = lines[i][1];
    g.newLink(x, y, lines[i][2]);
    g.element(x, y).strokeWidth(2).valueRule(R.PointAtPathByRate(0.5, "x", "y"));
}

main();

async function main() {
    lines.sort((a, b) => {
        return a[2] - b[2];
    })
    for (let i = 0; i < lines.length; i++) {
        let x = lines[i][0];
        let y = lines[i][1];
        await sd.pause();
        board.text("Check Line x = " + String(x) + " y = " + String(y));
        
        await sd.pause();
        g.startAnimate();
        g.element(x, y).stroke(C.red);
        g.element(x).color(C.RED);
        g.element(y).color(C.RED);
        g.endAnimate();
        
        await sd.pause();
        g.startAnimate();
        let fx = getFa(x);
        let fy = getFa(y);
        if (fx !== fy) {
            fa[fx] = fy;
            g.element(x, y).stroke(C.green);
        } else g.element(x, y).stroke(C.grey);
        g.element(x).color(C.DEFAULT);
        g.element(y).color(C.DEFAULT);
        g.endAnimate();
    }
}