import * as sd from "#lib/slide";

let svg = sd.svg();
let R = sd.reader();
let n = 3, m = 8;
let data = R.readIntMatrix(`1 3 2 3 1 2 3 1 2 3 1 2 1 3 2 3 1 2 3 1 2 3 1 2`, m, n);
let mp = sd.Grid(svg).n(n).m(m).x(100).y(100).startN(1).startM(1);
for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
        mp.value(i, j, sd.Text(svg, data[j][i]));