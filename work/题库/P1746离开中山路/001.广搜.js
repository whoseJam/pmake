import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let n = 5, m = 5;
let sx = 1, sy = 1;
let dx = [1, 0, -1, 0];
let dy = [0, 1, 0, -1];
let dis2col = ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"];
let q = sd.Array(svg).x(270).y(60).elementWidth(50).elementHeight(50).drag(true).resizeable(true);
sd.EnableArrayName(q, "队列");
let data = R.readCharMatrix(`01000 00010 01000 00010 00010`, n, m);
let mp = sd.Grid(svg).n(n).m(m).startN(1).startM(1).x(120).y(180).elementWidth(80).elementHeight(80).drag(true).resizeable(true);
let dis = sd.Grid(svg).n(n).m(m).startN(1).startM(1).x(680).y(180).elementWidth(80).elementHeight(80).drag(true).resizeable(true);
sd.EnableTitle(mp, "地图", 30);
sd.EnableTitle(dis, "最短路径地图", 30);
for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
        mp.value(i, j, sd.Text(mp, data[i][j]));
        dis.value(i, j, sd.Text(dis, "?"));
    }
}

main();

async function main() {
    await sd.pause();
    q.startAnimate();
    q.push(info(q, sx, sy));
    q.color(0, dis2col[0]);
    q.endAnimate();
    dis.startAnimate();
    dis.value(sx, sy, sd.Text(dis, "0"));
    dis.color(sx, sy, dis2col[0]);
    dis.endAnimate();
    mp.element(sx, sy).visited = true;
    while (q.length() >= 1) {
        await sd.pause();
        let u = q.value(0);
        q.startAnimate();
        q.erase(0);
        q.endAnimate();
        let curx = u.px;
        let cury = u.py;
        mp.startAnimate();
        mp.color(curx, cury, C.orange);
        mp.endAnimate();

        for (let i = 0; i < 4; i++) {
            let nxtx = curx + dx[i];
            let nxty = cury + dy[i];
            if (1 <= nxtx && nxtx <= n && 1 <= nxty && nxty <= m && !mp.element(nxtx, nxty).visited && (+mp.value(nxtx, nxty).text()) == 0) {
                await sd.pause();
                mp.startAnimate();
                let fs = mp.value(nxtx, nxty).fontSize();
                mp.value(nxtx, nxty).fontSize(fs * 1.2);
                mp.endAnimate();
                mp.startAnimate();
                mp.value(nxtx, nxty).fontSize(fs);
                mp.endAnimate();
                
                await sd.pause();
                q.startAnimate();
                q.push(info(q, nxtx, nxty));
                q.color(q.end(), dis2col[(+dis.value(curx, cury).text()) + 1]);
                q.endAnimate();
                mp.startAnimate();
                mp.element(nxtx, nxty).visited = true;
                mp.color(nxtx, nxty, C.green);
                mp.endAnimate();
                dis.startAnimate();
                dis.value(nxtx, nxty, sd.Text(dis, (+dis.value(curx, cury).text()) + 1));
                dis.color(nxtx, nxty, dis2col[(+dis.value(curx, cury).text()) + 1]);
                dis.endAnimate();
            }
        }
        await sd.pause();
        mp.startAnimate();
        mp.color(curx, cury, C.grey);
        mp.endAnimate();
    }
}

function info(svg, x, y) {
    let rct = sd.Rect(svg).strokeOpacity(0).fillOpacity(0);
    let t1 = sd.Text(rct, `x=${x}`);
    let t2 = sd.Text(rct, `y=${y}`);
    let rule1 = () => {
        t1.cx(rct.cx())
        t1.cy(rct.y() + rct.height() * 0.25);
    };
    let rule2 = () => {
        t2.cx(rct.cx());
        t2.cy(rct.y() + rct.height() * 0.75);
    };
    rct.children.push(t1, rule1);
    rct.children.push(t2, rule2);
    rct.px = x; rct.py = y;
    return rct;
}