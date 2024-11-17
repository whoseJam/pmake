import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.ValueGridGraph(svg).width(250).height(200);
const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow];
const n = 30;
const low = sd.make1d(n + 5);
const dfn = sd.make1d(n + 5);
const ins = sd.make1d(n + 5);
const stk = sd.make1d(n + 5);
const prt = sd.make1d(n + 5);
const seq = [];
let tot = 0;
let top = 0;
const graphs = {
    1: {
        n: 4,
        x: 0,
        y: 0,
        links: [[1, 2], [2, 3], [3, 4], [4, 1], [1, 3]]
    },
    2: {
        n: 3,
        x: 1,
        y: 0,
        links: [[1, 2], [2, 3], [3, 1]],
    },
    3: {
        n: 1,
        x: 0.5,
        y: 0.5,
        links: []
    },
    4: {
        n: 3,
        x: 0,
        y: 1,
        links: [[1, 2], [2, 3], [3, 1]]
    },
    5: {
        n: 4,
        x: 1,
        y: 1,
        links: [[1, 2], [2, 3], [3, 4], [4, 1], [2, 4]]
    }
};
const externLinks = [
    [[1, 3], [3, 1], sd.Line, {}],
    [[1, 3], [2, 1], sd.Curve, {}],
    [[3, 1], [4, 2], sd.Line, {}],
    [[3, 1], [5, 2], sd.Curve, {}],
    [[1, 4], [4, 1], sd.Line, {}],
    [[4, 3], [5, 4], sd.Line, {}]
]

sd.init(() => {
    for (let id in graphs) {
        graphs[id].graph = MakeTinyGraph(graphs[id].n, graphs[id].links);
        grid.at(graphs[id].x, graphs[id].y).newNode(id, graphs[id].graph);
    }
    externLinks.forEach(link => {
        link[3].link = sd.Link(
            grid.element(link[0][0]).element(link[0][1]),
            grid.element(link[1][0]).element(link[1][1]),
            link[2]
        ).arrow();
        link[3].link.clazz = link[2];
    });
    stack.y(Element(Id(1, 1)).y());
})

sd.main(async () => {
    await sd.pause();
    await Dfs(Id(1, 1));
    
    await sd.pause();
    grid.startAnimate();
    for (let graphId in graphs) {
        for (let i = 1; i <= graphs[graphId].n; i++) {
            if (low[Id(graphId, i)] === dfn[Id(graphId, i)]) {
                graphs[graphId].graph.color(i, C.green);
            }
        }
    }
    grid.endAnimate();
    await sd.pause();
    for (let graphId in graphs) {
        for (let i = 1; i <= graphs[graphId].n; i++) {
            if (low[Id(graphId, i)] === dfn[Id(graphId, i)]) {
                const element = graphs[graphId].graph.element(i);
                element.startAnimate().color(C.white).strokeWidth(3).endAnimate();
            }
        }
    }

    await sd.pause();
    for (let i = 0; i < seq.length; i++) {
        const u = seq[i];
        if (u === "pop") {
            while (true) {
                const last = +stack.lastElement().nodeId;
                await sd.pause();
                stack.startAnimate();
                stack.color(stack.end(), colorList[GraphId(last) - 1]);
                stack.startAnimate();
                Element(last).startAnimate().color(colorList[GraphId(last) - 1]).endAnimate();
                await sd.pause();
                stack.startAnimate();
                stack.pop();
                stack.endAnimate();
                if (low[last] === dfn[last]) {
                    break;
                }
            }
            await sd.pause();
        } else {
            if (low[u] === dfn[u]) await sd.pause();
            Element(u).startAnimate().value(i+1).endAnimate();
            const textOld = Element(u).value();
            const textNew = new sd.Text(svg, i+1).fontSize(textOld.fontSize()).center(textOld.center());
            stack.startAnimate().pushFromExistValue(textNew).endAnimate();
            stack.lastElement().nodeId = u;
        }
    }
})

function MakeTinyGraph(n, links) {
    const graph = new sd.TinyGraph(svg).width(180).height(180);
    for (let i = 1; i <= n; i++) {
        graph.newNode(i, "");
    }
    links.forEach(link => {
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
    return graph;
}

async function Dfs(u) {
    low[u] = dfn[u] = ++tot;
    seq.push(u);
    ins[stk[++top] = u] = true;

    const toNodes = ToNodes(u);
    for (let to of toNodes) {
        const v = to.id;
        if (!dfn[v]) {
            LinkTo(to.link, C.textBlue);
            prt[v] = u;
            await Dfs(to.id);
            low[u] = Math.min(low[u], low[v]);
        } else {
            LinkTo(to.link, IsAncesstor(v, u) ? C.red : IsAncesstor(u, v) ? C.orange : C.purple);
            if (ins[v]) low[u] = Math.min(low[u], dfn[v]);
        }
    }

    if (low[u] === dfn[u]) {
        seq.push("pop");
        while (top) {
            const cur = stk[top--];
            ins[cur] = false;
            if (cur === u) break;
        }
    }
}

function IsAncesstor(a, u) {
    while (prt[u] && u != a) u = prt[u];
    return (u == a);
}

function LinkTo(link, color) {
    const clazz = link.clazz ? link.clazz : sd.Line;
    const l = new clazz(svg);
    l.source(link.source());
    l.target(link.target());
    l.stroke(color).strokeWidth(2.5);
    l.startAnimate().pointStoT().endAnimate().arrow();
}

function ToNodes(u) {
    const graph = graphs[GraphId(u)].graph;
    const children = graph.outNodes(NodeId(u)).map(node => {
        return {
            id: Id(GraphId(u), graph.nodeId(node)),
            link: graph.element(NodeId(u), graph.nodeId(node)),
            node: node
        };
    });
    const extern = externLinks.filter(link => link[0][0] === GraphId(u) && link[0][1] === NodeId(u)).map(link => {
        return {
            id: Id(link[1][0], link[1][1]),
            link: link[3].link,
            node: graphs[link[1][0]].graph.element(link[1][1])
        }
    });
    return [...children, ...extern];
}

function Id(graphId, nodeId) {
    graphId = +graphId;
    nodeId = +nodeId;
    return graphId * 5 + nodeId;
}

function Element(id) {
    const graphId = GraphId(id);
    const nodeId = NodeId(id);
    return graphs[graphId].graph.element(nodeId);
}

function GraphId(id) {
    return Math.floor(+id / 5);
}

function NodeId(id) {
    return +id % 5;
}