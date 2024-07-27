import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let n = 20, m = 20;
let mp = sd.Grid(svg).x(600).y(100).elementWidth(20).elementHeight(20).startM(1).startN(1).n(n).m(m).drag(true).resizeable(true);
let dx = [0, 1, 0, -1];
let dy = [1, 0, -1, 0];
let ans = sd.Text(svg, `Ans=${0}`).x(300).y(390).fontSize(55).drag(true).resizeable(true);
ans.ans = 0;
sd.EnableFocusRect(mp);
let data = R.readCharMatrix(`
15801692104449215038
39779110319183684006
12863368224845499208
55541817709408462611
62907867524746746653
69398258603730094802
71478682354751355646
54337064554356274548
69522421508960828772
08304955870537371157
04665012880111569008
84481867801206248731
63539274684389134846
96058553355944330522
23488158132297516649
64271938993299404770
07482980228519790476
79799399894223954988
07860411760485100890
11358661151345314263`, n, m);
let col;

for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
        mp.value(i, j, sd.Text(mp, data[i][j]));
    }

async function dfs(x, y) {
    for (let i = 0; i < 4; i++) {
        let nx = x + dx[i];
        let ny = y + dy[i];
        if (1 > nx || nx > n || 1 > ny || ny > m) continue;
        if (mp.element(nx, ny).visited) continue;
        if (mp.value(nx, ny).text() === "0") continue;
        
        mp.element(nx, ny).visited = true;
        mp.startAnimate().color(nx, ny, col).endAnimate();

        await dfs(nx, ny);
    }
}

async function main() {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m ; j++) {
            await sd.pause();
            mp.startAnimate();
            mp.focus(i, j);
            mp.endAnimate();

            if (mp.element(i, j).visited) continue;
            if (mp.value(i, j).text() === "0") continue;
            col = C.rand();

            await sd.pause();
            ans.startAnimate().opacity(0).endAnimate();
            ans.text(`Ans=${++ans.ans}`);
            ans.startAnimate().opacity(1).endAnimate();

            await sd.pause();
            mp.startAnimate();
            mp.color(i, j, col);
            mp.endAnimate();

            await dfs(i, j);
        }
    }
}

main();