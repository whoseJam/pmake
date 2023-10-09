import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 3, m = 3, k = 2;
let sx = 1, sy = 1;
let ex = 3, ey = 3;
let dx = [0, 1, 0, -1];
let dy = [1, 0, -1, 0];
let ans = sd.Text(svg, "Ans=0").x(800).y(460).fontSize(30).drag(true).resizeable(true); ans.ans = 0;
let blocks = [
    [], [1, 2], [3, 1]
];
let mp = sd.Grid(svg).x(250).y(430).startN(1).startM(1).n(n).m(m).drag(true).resizeable(true);
let vis = sd.Grid(svg).x(540).y(430).startN(1).startM(1).n(n).m(m).drag(true).resizeable(true);
let code = sd.Code(svg).x(10).y(10).code(`
int dx[4]={0,1,0,-1};
int dy[4]={1,0,-1,0};
bool vis[100][100];
int mp[100][100];
void Dfs(int x,int y){
    if(x==ex&&y==ey){
        ans++;
        return;
    }
    for(int i=0;i<4;i++){
        int nxtx=x+dx[i];
        int nxty=y+dy[i];
        if(1<=nxtx&&nxtx<=n&&1<=nxty&&nxty<=m&&!vis[nxtx][nxty]&&mp[nxtx][nxty]!=1){
            vis[nxtx][nxty]=1;
            Dfs(nxtx,nxty);
            vis[nxtx][nxty]=0;
        }
    }
}`).drag(true).resizeable(true);
let codeLines = {
    define: [1, 4],
    startDfs: [5],
    checkTarget: [6],
    onTarget: [7, 8],
    iterate: [10],
    nxt: [11, 12],
    checkValid: [13],
    onValid: [14, 16],
    setVisTo1: [14],
    dfs: [15],
    setVisTo0: [16]
};
sd.EnableTitle(vis, "vis数组", 20);
sd.EnableTitle(mp, "map数组", 20);
for (let i = 1; i <= k; i++)
    mp.value(blocks[i][0], blocks[i][1], sd.Rect(mp).color(C.GREY));

main();

async function main() {
    await sd.pause();
    mp.startAnimate();
    mp.color(sx, sy, C.green);
    mp.endAnimate();
    mp.element(sx, sy).visited = true;
    vis.startAnimate().value(sx, sy, sd.Text(vis, 1)).endAnimate();

    Dfs(sx, sy);

}

async function Dfs(x, y) {
    await sd.pause();
    code.startAnimate().highlight(codeLines.startDfs).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(codeLines.checkTarget).endAnimate();

    if (x === ex && y === ey) {
        await sd.pause();
        code.startAnimate().highlight(codeLines.onTarget).endAnimate();
        await sd.pause();
        ans.startAnimate().opacity(0).dy(10).endAnimate();
        ans.text(`Ans=${++ans.ans}`).dy(-20);
        ans.startAnimate().opacity(1).dy(10).endAnimate();
        return;
    }

    for (let i = 0; i < 4; i++) {
        await sd.pause();
        code.startAnimate().highlight(codeLines.iterate).endAnimate();
        await sd.pause();
        code.startAnimate().highlight(codeLines.checkValid).endAnimate();

        let ar = sd.Line(svg);
        ar.x1(mp.element(x, y).cx());
        ar.y1(mp.element(x, y).cy());
        ar.x2(mp.element(x, y).cx() + dy[i] * mp.elementWidth() * 0.8);
        ar.y2(mp.element(x, y).cy() + dx[i] * mp.elementHeight() * 0.8);
        ar.markerEnd("arrow");
        ar.opacity(0).startAnimate().opacity(1).endAnimate();
        let nx = x + dx[i];
        let ny = y + dy[i];
        let waitFlag = true;
        if (1 <= nx && nx <= n && 1 <= ny && ny <= m && !mp.element(nx, ny).visited && !mp.value(nx, ny)) {
            await sd.pause();
            code.startAnimate().highlight(codeLines.onValid).endAnimate();
            await sd.pause();
            code.startAnimate().highlight(codeLines.setVisTo1).endAnimate();
            await sd.pause();
            vis.startAnimate().value(nx, ny, sd.Text(vis, 1)).endAnimate();
            mp.startAnimate();
            mp.color(x, y, C.blue);
            mp.color(nx, ny, C.green);
            mp.endAnimate();
            mp.element(nx, ny).visited = true;

            await sd.pause();
            code.startAnimate().highlight(codeLines.dfs).endAnimate();
            await Dfs(nx, ny);

            await sd.pause();
            code.startAnimate().highlight(codeLines.setVisTo0).endAnimate();
            await sd.pause();
            vis.startAnimate().value(nx, ny, null).endAnimate();
            await sd.pause();
            mp.startAnimate();
            mp.color(x, y, C.green);
            mp.color(nx, ny, C.white);
            mp.endAnimate();
            mp.element(nx, ny).visited = false;
            waitFlag = false;
        }
        if (waitFlag) await sd.pause();
        ar.startAnimate();
        ar.opacity(0);
        ar.endAnimate();
        ar.remove();
    }
}