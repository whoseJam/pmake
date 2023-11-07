import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let L = sd.layout();
let R = sd.reader();
let LY, RY, Y;

main();

async function main() {
    // await testArray();
    // await testMoreArray();
    // await testMathjax();
    // await testCode();
    // await testTree();
    // await testGrid();
    // await testVarTable();
    // await testCallStack();
    // await testCurve();
    await testGraph();
}

async function testGraph() {

}

async function testCurve() {
    await sd.pause();
    let title = L.Title("Curve组件展示");
    let GAP = 30;
    let Y = title.my() + GAP;
    
    await sd.pause();
    let para1 = sd.Code(svg).x(700).y(Y);
    para1.startAnimate().push("Curve系组件用来绘制曲线，底层元素是Path").endAnimate();

    await sd.pause();
    let c1 = sd.Curve(svg).source(100, Y).target(400, Y);
    c1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let c2 = sd.VHCurve(svg).source(100, Y + 100).target(600, Y + 150);
    c2.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let c3 = sd.BezierCurve(svg).source(100, Y + 200).target(600, Y + 250);
    c3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let c4 = sd.VHBezierCurve(svg).source(100, Y + 300).target(600, Y + 350);
    c4.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    para1.startAnimate().push("一个简单的线条缓出效果").endAnimate();
    c1.strokeDashOffset(0).strokeDashArray(c1.totalLength());
    c2.strokeDashOffset(0).strokeDashArray(c2.totalLength());
    c3.strokeDashOffset(0).strokeDashArray(c3.totalLength());
    c4.strokeDashOffset(0).strokeDashArray(c4.totalLength());
    await sd.pause();
    c1.startAnimate().strokeDashOffset(c1.totalLength()).endAnimate();
    await sd.pause();
    para1.startAnimate().push("可以用它来做丰富的路径动画").endAnimate();
    await sd.pause();
    let cc = sd.Circle(svg);
    Snap.animate(0, c1.totalLength(), function(value) {
        let movePoint = c1.getPointAtLength( value );
        cc.cx(movePoint[0])
        cc.cy(movePoint[1]);
    }, 1000, mina.easeinout);
    await sd.pause();
    cc.startAnimate().cx(600).cy(Y + 150).endAnimate();
    await sd.pause();
    c2.startAnimate().strokeDashOffset(c2.totalLength()).endAnimate();
    await sd.pause();
    Snap.animate(0, c2.totalLength(), function(value) {
        let movePoint = c2.getPointAtLength(c2.totalLength() - value);
        cc.cx(movePoint[0])
        cc.cy(movePoint[1]);
    }, 1000, mina.easeinout);
    await sd.pause();
    cc.startAnimate().cx(100).cy(Y + 200).endAnimate();
    await sd.pause();
    c3.startAnimate().strokeDashOffset(-c3.totalLength()).endAnimate();
    await sd.pause();
    Snap.animate(0, c3.totalLength(), function(value) {
        let movePoint = c3.getPointAtLength( value );
        cc.cx(movePoint[0])
        cc.cy(movePoint[1]);
    }, 1000, mina.easeinout);
    await sd.pause();
    cc.startAnimate().cx(600).cy(Y + 350).endAnimate();
    await sd.pause();
    c4.startAnimate().strokeDashOffset(c4.totalLength()).endAnimate();
    await sd.pause();
    Snap.animate(0, c4.totalLength(), function(value) {
        let movePoint = c4.getPointAtLength(c4.totalLength() - value);
        cc.cx(movePoint[0])
        cc.cy(movePoint[1]);
    }, 1000, mina.easeinout);

    let deletes = [c1, c2, c3, c4, cc, para1, title];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testCallStack() {
    await sd.pause();
    let title = L.Title("CallStack组件展示");
    let GAP = 50;
    let Y = title.my() + GAP;

    await sd.pause();
    let minSearch = `
int searchMin(State s){
    for(State nxtS:getSuccessor(s)){
        f[s]=min(f[s],searchMax(nxtS));
    }
    return f[s];
}`;
    let maxSearch = `
int searchMax(State s){
    for(State nxtS:getSuccessor(s)){
        f[s]=max(f[s],searchMin(nxtS));
    }
    return f[s];
}`;
    let stack1 = sd.CallStack(svg).x(400).y(Y);
    stack1.startAnimate();
    stack1.enter({ 
        name: "searchMin",
        args: [
            { name: "state", value: "起点" }
        ]
    }, minSearch);
    stack1.endAnimate();

    await sd.pause();
    stack1.startAnimate();
    stack1.enter({
        name: "searchMax",
        args: [
            { name: "state", value: "第一步" }
        ]
    }, maxSearch);
    stack1.endAnimate();

    await sd.pause();
    stack1.startAnimate();
    stack1.enter({ 
        name: "searchMin",
        args: [
            { name: "state", value: "第二步" }
        ]
    }, minSearch);
    stack1.endAnimate();

    await sd.pause();
    stack1.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    stack1.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    stack1.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    stack1.startAnimate().highlight(4).endAnimate();
    await sd.pause();
    stack1.startAnimate().highlight(5).endAnimate();
    await sd.pause();
    stack1.startAnimate().highlight(6).endAnimate();
    await sd.pause();
    stack1.startAnimate().exit().endAnimate();
    await sd.pause();
    stack1.startAnimate().exit().endAnimate();

    let deletes = [stack1, title];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testVarTable() {
    await sd.pause();
    let title = L.Title("Grid组件展示");
    let GAP = 50;
    let Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.startAnimate().push("VarTable组件是一种特殊的Grid组件").endAnimate();
    await sd.pause();
    para1.startAnimate().push("它是一个n行两列的表格").endAnimate();
    await sd.pause();
    para1.startAnimate().push("它提供了对变量的表视图").endAnimate();
    await sd.pause(); 
    para1.startAnimate().push("可以通过put方法新增/修改变量").endAnimate();
    await sd.pause();
    let table1 = sd.VarTable(svg).x(600).y(Y);
    table1.startAnimate().put("a", 1).endAnimate();
    table1.startAnimate().put("b", 5).endAnimate();
    table1.startAnimate().put("str", "Hello").endAnimate();
    await sd.pause();
    table1.startAnimate().put("b", 233).endAnimate();
    await sd.pause();
    table1.startAnimate().put("str", "Hello World").endAnimate();
    await sd.pause();
    table1.startAnimate().elementWidth(100).endAnimate();
    await sd.pause();
    let deletes = [title, table1, para1];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testGrid() {
    await sd.pause();
    let title = L.Title("Grid组件展示");
    let GAP = 50;
    let Y = title.my() + GAP;

    {   await sd.pause();
        let para1 = sd.Code(svg).x(100).y(Y);
        para1.startAnimate().push("Grid组件为展示二维网格地图提供了方便的操作").endAnimate();
        await sd.pause();    
        let dx = [1, 1, 2, 2, -1, -1, -2, -2, 0];
        let dy = [2, -2, 1, -1, 2, -2, 1, -1, 0];
        let n = 5, m = 9;
        let cx = 4, cy = 3;
        let grid1 = sd.Grid(svg).n(n).m(m).startN(1).startM(1);
        grid1.x(600).y(Y).opacity(0).startAnimate().opacity(1).endAnimate();
        for (let i = 0; i < 9; i++) {
            let tx = cx + dx[i];
            let ty = cy + dy[i];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= m)
                grid1.value(tx, ty, sd.Circle(svg).color(C.ORANGE));
        }
        await sd.pause();
        grid1.startAnimate().color(1, 1, C.blue).endAnimate();
        await sd.pause();
        grid1.startAnimate().value(1, 1, sd.Text(svg, 1)).endAnimate();
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                if (grid1.value(i, j)) continue;
                await sd.pause();
                grid1.startAnimate();
                grid1.color(i, j, C.blue);
                grid1.endAnimate();
                await sd.pause();
                grid1.startAnimate();
                let ans = 0;
                if (i-1 >= 1 && grid1.value(i-1, j).text) ans += +grid1.value(i-1, j).text();
                if (j-1 >= 1 && grid1.value(i, j-1).text) ans += +grid1.value(i, j-1).text();
                grid1.value(i, j, sd.Text(svg, ans));
                grid1.endAnimate();
            }
        }
        await sd.pause();
        let deletes = [grid1, para1];
        for (let i = 0; i < deletes.length; i++)
            deletes[i].startAnimate().opacity(0).endAnimate().remove();
    }

    {   await sd.pause();
        let para1 = sd.Code(svg).x(100).y(Y);
        para1.startAnimate().push("对于不规则的地图，可以考虑使用SquidGrid").endAnimate();
        await sd.pause();
        function makeTri(svg, n) {
            let tri = sd.SquidGrid(svg).startN(1).startM(1);
            for (let i = 1; i <= n; i++)
                tri.pushRow(i);
            return tri;
        }
        function makeArrow(svg, fx, fy, tx, ty) {
            let line = sd.Line(svg).markerEnd("arrow");
            let fe = svg.value(fx, fy);
            let te = svg.value(tx, ty);
            let rule = () => {
                line.x1(fe.cx()).y1(fe.cy())
                    .x2(te.cx()).y2(te.cy());
                sd.trim(line, fe, te);
            }
            svg.children.push(line, rule);
            return line;
        }
        let data = [
            [],
            [0, 7],
            [0, 3, 8],
            [0, 8, 1, 0],
            [0, 2, 7, 4, 4],
            [0, 4, 5, 2, 6, 5]
        ];
        let tri = makeTri(svg, 5).x(100).y(para1.my() + GAP);
        let dp = makeTri(svg, 5).x(600).y(para1.my() + GAP);
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= i; j++) {
                tri.value(i, j, sd.Text(tri, data[i][j]));
            }
        }
        for (let i = 5; i >=1; i--) {
            for (let j = 1; j <= i; j++) {
                await sd.pause();
                dp.startAnimate();
                dp.color(i, j, C.ORANGE);
                dp.endAnimate();
    
                if (i + 1 <= 5) {
                    await sd.pause();
                    let v = data[i][j];
                    let part1 = Number(dp.value(i+1, j).text());
                    let part2 = Number(dp.value(i+1, j+1).text());
                    dp.startAnimate();
                    dp.color(i+1, j, C.BLUE);
                    dp.color(i+1, j+1, C.BLUE);
                    dp.endAnimate();
                    tri.startAnimate();
                    tri.color(i, j, C.BLUE);
                    tri.endAnimate();
                    await sd.pause();
                    let ans = Math.max(part1, part2) + data[i][j];
                    dp.startAnimate();
                    dp.value(i, j, sd.Text(dp, ans));
                    dp.endAnimate();
                    await sd.pause();
                    let arrow;
                    if (part1 > part2) arrow = makeArrow(dp, i, j, i+1, j);
                    else arrow = makeArrow(dp, i, j, i+1, j+1);
                    arrow.opacity(0)
                         .startAnimate()
                         .opacity(1)
                         .endAnimate();
                } else {
                    await sd.pause();
                    dp.startAnimate()
                    dp.value(i, j, sd.Text(dp, data[i][j]));
                    dp.endAnimate();
                }
                await sd.pause();
                dp.startAnimate();
                dp.color(i, j, C.DEFAULT);
                tri.startAnimate();
                tri.color(i, j, C.DEFAULT);
                tri.endAnimate();
                if (i + 1 <= 5) {
                    dp.color(i+1, j, C.DEFAULT);
                    dp.color(i+1, j+1, C.DEFAULT);
                }
                dp.endAnimate();
            }
        }
        await sd.pause();
        let pos = 1;
        for (let i = 1; i <= 5; i++) {
            dp.startAnimate();
            dp.color(i, pos, C.GREEN);
            dp.endAnimate();
            tri.startAnimate()
            tri.color(i, pos, C.GREEN);
            tri.endAnimate();
            if (i + 1 <= 5) {
                let part1 = Number(dp.value(i+1, pos).text());
                let part2 = Number(dp.value(i+1, pos+1).text());
                if (part1 > part2) pos = pos;
                else pos = pos + 1;
            }
        }
        await sd.pause();
        let deletes = [dp, tri, para1];
        for (let i = 0; i < deletes.length; i++)
            deletes[i].startAnimate().opacity(0).endAnimate().remove();
    }
    let deletes = [title];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testTree() {
    await sd.pause();
    let title = L.Title("Tree组件展示");
    let GAP = 50;
    let Y = title.my() + GAP;
    
    {   let para1 = sd.Code(svg).x(100).y(Y);
        let tree1 = sd.Tree(svg).x(600).y(Y).layerHeight(60).width(600);
        let arr1 = sd.Array(svg).x(100).y(500);
        let h = sd.make1d(100);
        let l = sd.make1d(100);
        let sz = sd.make1d(100);
        let sn = sd.make1d(100);
        let cnt = 0;
        async function dfs1(now, prt) {
            sz[now] = 1;
            for (let i = h[now]; i; i = l[i].nxt) {
                let v = l[i].to;
                if (v !== prt) {
                    await dfs1(v, now);
                    if (sz[sn[now]] < sz[v])
                        sn[now] = v;
                    sz[now] += sz[v];
                }
            }
            if (sn[now]) {
                tree1.element(now, sn[now]).background().strokeWidth(5);
                tree1.element(now, sn[now]).background().stroke(C.red);
            }
        }
        async function dfs2(now, prt) {
            await sd.pause();
            tree1.startAnimate();
            if (prt) tree1.color(prt, C.DEFAULT);
            tree1.color(now, C.GREEN);
            tree1.endAnimate();
            await sd.pause();
            arr1.startAnimate().push(`v${now}`).endAnimate();
            if (sn[now]) await dfs2(sn[now], now);
            for (let i = h[now]; i; i = l[i].nxt) {
                let v = l[i].to;
                if (v !== prt && v !== sn[now]) {
                    await dfs2(v, now);
                }
            }
            await sd.pause();
            tree1.startAnimate();
            if (prt) tree1.color(prt, C.GREEN);
            tree1.color(now, C.DEFAULT);
            tree1.endAnimate();
        }
        function link(x, y) {
            tree1.link(x, y);
            l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
            l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
        }
        tree1.root(1);
        link(1, 2);
        link(1, 3);
        link(1, 4);
        link(2, 5);
        link(3, 6);
        link(3, 7);
        link(4, 8);
        link(5, 9);
        link(5, 10);
        link(6, 11);
        link(7, 12);
        link(8, 13);
        link(8, 14);
        link(10, 15);
        link(11, 16);
        link(16, 17);
        link(16, 18);
        tree1.opacity(0);
        await sd.pause();
        para1.startAnimate().push("可以利用Tree组件，先随便画一棵树").endAnimate();
        await sd.pause();
        tree1.startAnimate().opacity(1).endAnimate();
        await sd.pause();
        para1.startAnimate().push("我记得有个算法叫做树链剖分...").endAnimate();
        await sd.pause();
        tree1.startAnimate();
        await dfs1(1);
        tree1.endAnimate();
        await sd.pause();
        para1.startAnimate().push("把树转化成序列...").endAnimate();
        await dfs2(1);
        let deletes = [tree1, para1, arr1];
        for (let i = 0; i < deletes.length; i++)
            deletes[i].startAnimate().opacity(0).endAnimate().remove();
    }

    {   await sd.pause();
        let para1 = sd.Code(svg).x(100).y(Y);
        para1.code("我们可以用BoxTree组件，方便地画出某个函数的递归树");
        await sd.pause();
        let tree1 = sd.BoxTree(svg).x(500).y(Y).width(700);
        let nodeId = 0;
        async function fib(n, isRoot = false) {
            if (n <= 2) {
                let myId = ++nodeId;
                tree1.element(myId).value(`fib(${n})=${1}`);
                return 1;
            }
            let myId = ++nodeId;
            if (isRoot) tree1.root(myId);
            tree1.link(myId, nodeId + 1);
            let a = await fib(n - 1);
            tree1.link(myId, nodeId + 1);
            let b = await fib(n - 2);
            tree1.element(myId).value(`fib(${n})=${a + b}`);
            return a + b; 
        }
        await fib(6, true);
        tree1.opacity(0).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        let deletes = [tree1, para1];
        for (let i = 0; i < deletes.length; i++)
            deletes[i].startAnimate().opacity(0).endAnimate().remove();
    }

    {   await sd.pause();
        let para1 = sd.Code(svg).x(100).y(Y);
        para1.startAnimate().push("线段树怎么不能是一棵树呢？").endAnimate();
        await sd.pause();
        para1.startAnimate().push("线段树上的每个节点可以考虑成一个数组").endAnimate();
        await sd.pause();
        para1.startAnimate().push("此时建议用ValueTree组件").endAnimate();
        await sd.pause();
        Y = para1.my() + GAP;
        let tree1 = sd.ValueTree(svg).x(100).y(Y).width(1000).layerHeight(70);
        let nodeId = 0;
        let data = R.readIntArray("1, 4, 2, 7, 5, 6, 3, 8", 8);
        function makeNode(l, r) {
            let arr = sd.Array(tree1).start(l);
            for (let i = l; i <= r; i++) arr.push(data[i]);
            return arr;
        }
        async function build(l, r, prt) {
            let myId = ++nodeId;
            if (prt) tree1.link({ parent: prt, id: myId, value: makeNode(l, r) });
            else tree1.root({ id: myId, value: makeNode(l, r) });
            if (l === r) return;
            let mid = Math.floor((l + r) / 2);
            await build(l, mid, myId);
            await build(mid + 1, r, myId);
        }
        await build(1, 8);
        tree1.opacity(0).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        para1.startAnimate();
        para1.push("ValueTree组件的好处是不会对内部元素进行自适应调整");
        para1.push("当然也可用BoxTree组件试试，不过效果会很差");
        para1.endAnimate();
        Y = para1.my() + GAP;
        tree1.startAnimate();
        tree1.y(Y);
        tree1.endAnimate();
        await sd.pause()
        tree1.startAnimate().opacity(0).endAnimate();
        let tree2 = tree1;
        nodeId = 0;
        tree1 = sd.BoxTree(svg).x(100).y(Y).width(1000).layerHeight(70)
        await build(1, 8);
        tree1.opacity(0).after(tree2).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        let deletes = [
            tree1, para1,
            tree2
        ];
        for (let i = 0; i < deletes.length; i++)
            deletes[i].startAnimate().opacity(0).endAnimate().remove();
    }
    let deletes = [title];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testCode() {
    await sd.pause();
    let title = L.Title("Code组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("Code为代码展示提供了方便的API");
    await sd.pause();
    let code1 = sd.Code(svg).x(600).y(Y);
    let table1 = sd.VarTable(svg).x(600).y(350);
    code1.code(`
int main(){
    int a=0;
    int b=1;
    int c;
    c=a+b;
}`);
    await sd.pause();
    code1.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    table1.startAnimate().put("a", 0).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    table1.startAnimate().put("b", 1).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(4).endAnimate();
    await sd.pause();
    table1.startAnimate().put("c", "未知").endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(5).endAnimate();
    await sd.pause();
    table1.startAnimate().put("c", 1).endAnimate();
    await sd.pause();
    code1.startAnimate().dehighlight().endAnimate();
    await sd.pause();
    para1.startAnimate().push("对于代码的高亮，Code提供了不同的粒度，方便讲解").endAnimate();
    await sd.pause();
    let code2 = sd.Code(svg).x(800).y(Y);
    code2.startAnimate();
    code2.code(`
for(int i=2;i<=n;i++){
    if(!vis[i])prim[++tot]=i;
    for(int j=1;j<=tot&&i*prim[j]<=n;j++){
        vis[i*prim[j]]=1;
        if(i%prim[j]==0){
            // todo 1
            break;
        }
        // todo 2
    }
}`);
    code2.endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(1, 11).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(3, 10).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(6, 7).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(9).endAnimate();
    await sd.pause();
    code2.startAnimate().dehighlight().endAnimate();
    await sd.pause();
    let deletes = [
        code1, para1, table1,
        code2,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testMathjax() {
    let mathCode1 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    ? & ? & ? \\\\
    ? & ? & ?
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode2 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    ? & ? & ? \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode3 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    0 & \\infty & \\infty \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode4 = `
    \\begin{bmatrix}
    v_i & v_i & v_i \\\\
    0 & \\infty & \\infty \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`

    await sd.pause();
    let title = L.Title("Mathjax组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("Mathjax是我最喜欢的组件，它非常精美，\n但目前存在一定性能问题");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    para1.startAnimate().push("让我们从一个简单的等式开始").endAnimate();
    await sd.pause();
    let math1 = sd.Mathjax(svg).x(600).y(Y).math("")
    math1.startAnimate().math("A=\\frac B C").endAnimate();
    await sd.pause();
    para1.startAnimate().push("我们对它进行移项操作").endAnimate();
    await sd.pause();
    math1.startAnimate(5000).math("A\\cdot C = B").endAnimate();
    await sd.pause();
    math1.startAnimate().math("A+C=B").endAnimate();
    await sd.pause();
    math1.startAnimate().math("A=B-C").endAnimate();
    await sd.pause();
    para1.startAnimate().push("目前的数学公式非常简单，能不能来一点复杂的呢？").endAnimate();
    await sd.pause();
    Y = math1.my() + GAP;
    let math2 = sd.Mathjax(svg).x(600).y(Y).height(80).math("");
    math2.startAnimate().math(mathCode1).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode2).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode3).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode4).endAnimate();
    await sd.pause();
    let deletes = [
        math1, para1,
        math2,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testMoreArray() {
    await sd.pause();
    let title = L.Title("更多Array-Like组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("在一个Array-Like的组件中，有如下通用方法:");
    para1.push("1.start()：设置/获得数组的逻辑起点下标");
    para1.push("2.end()：获得数组的逻辑终点下标");
    para1.push("3.idx()：把一个逻辑下标转化成物理下标");
    para1.push("4.element(idx)：获取数组逻辑下标为idx的element");
    para1.push("5.value(idx)：获取数组逻辑下标为idx的value");
    para1.push("6.pop()：移除数组最后一个元素");
    para1.push("7.resize(size)：重设数组的大小");
    para1.push("8.opacity()：修改数组的透明度");
    para1.push("9.color()：修改数组的颜色");
    para1.push("10.length()：获取数组的长度");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr1 = sd.Array(svg).x(600).y(Y);
    arr1.startAnimate().push("This").endAnimate();
    arr1.startAnimate().push("is").endAnimate();
    arr1.startAnimate().push("Array").endAnimate();
    let arr2 = sd.Stack(svg).x(600).y(220).drag(true);
    arr2.startAnimate().push("This").endAnimate();
    arr2.startAnimate().push("is").endAnimate();
    arr2.startAnimate().push("Stack").endAnimate();
    let arr3 = sd.Pile(svg).x(680).y(340).drag(true);
    arr3.startAnimate().push("This").endAnimate();
    arr3.startAnimate().push("is").endAnimate();
    arr3.startAnimate().push("Pile").endAnimate();
    await sd.pause();
    let para2 = sd.Code(svg);
    para2.x(para1.x()).y(para1.my() + GAP);
    para2.startAnimate();
    para2.code("试试把每个数组的末尾元素标记为红色");
    para2.endAnimate();
    await sd.pause();
    arr1.startAnimate().color(arr1.end(), C.red).endAnimate();
    arr2.startAnimate().color(arr2.end(), C.red).endAnimate();
    arr3.startAnimate().color(arr3.end(), C.red).endAnimate();
    await sd.pause();
    let para3 = sd.Code(svg);
    L.List(para2, para3);
    para3.startAnimate();
    para3.code("来一个BarArray看看");
    para3.endAnimate();
    await sd.pause();
    let arr4 = sd.BarArray(svg).x(790).y(430).drag(true);
    arr4.startAnimate().push(3).endAnimate();
    arr4.startAnimate().push(2).endAnimate();
    arr4.startAnimate().push(5).endAnimate();
    arr4.startAnimate().push(7).endAnimate();
    await sd.pause();
    let deletes = [
        arr1, para1,
        arr2, para2,
        arr3, para3,
        arr4,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testArray() {
    await sd.pause();
    let title = L.Title("Array组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("你可以向一个数组里面添加空元素，\n就像:arr.push()这样");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr1 = sd.Array(svg).x(600).y(Y);
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    Y = Math.max(arr1.my(), para1.my()) + GAP;

    await sd.pause();
    let para2 = sd.Code(svg).x(100).y(Y);
    para2.code("也可以向数组中添加字符串/数字，\n就像:arr.push(1)这样");
    para2.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr2 = sd.Array(svg).x(600).y(Y);
    arr2.startAnimate().push(1).endAnimate();
    arr2.startAnimate().push(2).endAnimate();
    arr2.startAnimate().push("hello").endAnimate();
    arr2.startAnimate().push("world").endAnimate();
    Y = Math.max(arr2.my(), para2.my()) + GAP;

    await sd.pause();
    let para3 = sd.Code(svg).x(100).y(Y);
    para3.code("普通的数组可以添加许多插件，让数\n组的功能更加丰富");
    para3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    para3.startAnimate();
    para3.push("1.首先让数组里面添加10个元素，调用arr.resize(10)");
    para3.endAnimate();
    await sd.pause();
    let arr3 = sd.Array(svg).x(800).y(Y);
    arr3.startAnimate().resize(10).endAnimate();
    
    await sd.pause();
    para3.startAnimate();
    para3.push(`2.不妨给数组添加一个新名字，sd.EnableArrayName(arr, "队列", 20)`);
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayName(arr3, "队列", 20);

    await sd.pause();
    para3.startAnimate();
    para3.push(`3.不妨为数组编上下标，sd.EnableArrayIndex(arr)`);
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayIndex(arr3);

    await sd.pause();
    para3.startAnimate();
    para3.push("4.不妨为数组建立两个指针，H和T");
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayPointer(arr3);
    arr3.makePointer("H", 0);
    arr3.movePointer("H", 3);
    arr3.makePointer("T", 1);
    arr3.movePointer("T", 6);
    await sd.pause();
    arr3.startAnimate().movePointer("H", 4).endAnimate();
    await sd.pause();
    arr3.startAnimate().movePointer("T", 5).endAnimate();
    await sd.pause();
    arr3.startAnimate().movePointer("H", 5).endAnimate();

    await sd.pause();
    let deletes = [
        arr1, para1,
        arr2, para2,
        arr3, para3,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}