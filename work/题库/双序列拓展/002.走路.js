import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let g = sd.Grid(svg);
let x = sd.Array(svg);
let y = sd.Stack(svg);
let n, m;
let xdata = R.readIntArray("8 8 9", n = 3);
let ydata = R.readIntArray("7 7 4", m = 3);
g.x(200).y(200).n(n).m(m).startN(1).startM(1);
for (let i = 1; i <= n; i++)
    x.push(xdata[i]);
for (let i = 1; i <= m; i++)
    y.push(ydata[i]);
x.x(g.x()).my(g.y());
y.mx(g.x()).y(g.y());

for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
        if (xdata[i] > ydata[j])
            g.color(j, i, C.blue);
        else if (xdata[i] < ydata[j])
            g.color(j, i, C.green);
        else g.color(j, i, C.grey);
    }
}
