import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let t = sd.Tree(svg).drag(true).resizeable(true).x(400).y(130).width(460);
t.layerHeight(80);
let n = 7, q = 3;
let weight = R.readIntArray("1 2 3 4 5 6 7", n);
let edges = R.readIntMatrix("1 2 1 3 2 4 2 5 3 6 3 7", n, 2);
let querys = R.readIntMatrix("4 7 5 6 1 2", q, 2);

t.root({ id: 1, value: sd.Text(t, weight[1] )});
for (let i = 1; i <= n - 1; i++) {
    t.link({ 
        parent: edges[i][1],
        id: edges[i][2], 
        value: sd.Text(t, weight[edges[i][2]])
    });
}

main();

async function main() {
    for (let i = 1; i <= q; i++) {
        await sd.pause();
        let x = querys[i][1];
        let y = querys[i][2];
        t.startAnimate();
        t.color(x, C.BLUE);
        t.color(y, C.BLUE);
        t.endAnimate();
        await sd.pause();
        t.startAnimate();
        t.color(x, C.DEFAULT);
        t.color(y, C.DEFAULT);
        t.endAnimate();
    }
}