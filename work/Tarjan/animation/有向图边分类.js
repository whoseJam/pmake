import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).height(400).width(200).cx(400).cy(300).n(4).m(2);
const data = [
    [1, 2], [1, 5],
    [2, 3], [2, 4],
    [4, 3], [4, 8],
    [5, 6],
    [6, 4], [6, 1],
    [7, 8],
    [8, 9],
];

init();
main();

function init() {
    graph.at(0, 1).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(2, 0).newNode(3);
    graph.at(2, 1).newNode(4);
    graph.at(1, 2).newNode(5);
    graph.at(2, 2).newNode(6);
    graph.at(3, 2).newNode(7);
    graph.at(3, 1).newNode(8);
    graph.at(3, 0).newNode(9);
    data.forEach(link => {
        graph.newLink(link[0], link[1]);
    });
    graph._.linkType = sd.Curve;
    graph.newLink(9, 7);
    graph.links().forEach(link => link.arrow());
}

async function main() {
    await 边分类Tarjan(graph);
    await sd.pause();
}

/**
 * @param {sd.GraphBase} graph 
 */
async function 边分类Tarjan(graph) {
    const colorList = [C.coral, C.green, C.deepSkyBlue, C.violet, C.azure, C.peachPuff]; 
    const nodesId = graph.nodesId();
    const focus = sd.Focus(graph);
    const low = new sd.VarList(svg);
    const dfn = new sd.VarList(svg);
    const stk = new sd.Stack(svg);
    for (let id of nodesId) {
        low.put(`low[${id}]`, 0);
        dfn.put(`dfn[${id}]`, 0);
    }
    low.x(graph.mx() + 80).cy(graph.cy());
    dfn.x(low.mx() + 50).cy(graph.cy());
    stk.mx(graph.x() - 80).y(graph.y() - 20);

    const mark = (u, color) => {
        const originColor = u.fill();
        u.startAnimate().fill(color).endAnimate();
        return () => {
            u.startAnimate().fill(originColor).endAnimate();
        }
    }

    const linkTo = (u, v, line, color = C.black) => {
        if (line.fromNodeId === u.nodeId) line.stroke(color).startAnimate().pointStoT().endAnimate().arrow();
        else line.stroke(color).startAnimate().pointTtoS().endAnimate().revArrow();
    }

    let tot = 0;
    let SCC = 0;
    async function tarjan(u) {
        await sd.pause();
        focus.startAnimate().focus(u.nodeId).endAnimate();
        await sd.pause();
        stk.startAnimate().push(u.nodeId).endAnimate();
        u.low = u.dfn = ++tot; u.ins = true;
        low.startAnimate().put(`low[${u.nodeId}]`, tot).endAnimate();
        dfn.startAnimate().put(`dfn[${u.nodeId}]`, tot).endAnimate();
        graph.startAnimate().color(u.nodeId, C.blue).endAnimate();
        const to = graph.outLinks(u.nodeId);
        for (let i = 0, v; i < to.length; i++) {
            const link = to[i];
            v = graph.findNodeById(graph.toNodeId(u.nodeId, link));
            if (!v.dfn) {
                await sd.pause();
                linkTo(u, v, link);
                await tarjan(v);
                await sd.pause();
                focus.startAnimate().focus(u.nodeId).endAnimate();
                if (u.low > v.low) {
                    await sd.pause();
                    const recover = mark(v, C.orange);
                    await sd.pause();
                    u.low = v.low;
                    low.startAnimate().put(`low[${u.nodeId}]`, u.low).endAnimate();
                    await sd.pause();
                    recover();
                }
            } else if (v.ins) {
                await sd.pause();
                linkTo(u, v, link, C.red);
                if (u.low > v.dfn) {
                    await sd.pause();
                    const recover = mark(v, C.orange);
                    await sd.pause();
                    u.low = v.dfn;
                    low.startAnimate().put(`low[${u.nodeId}]`, u.low).endAnimate();
                    await sd.pause();
                    recover();
                }
            } else if (!v.ins) {
                await sd.pause();
                linkTo(u, v, link, C.purple);
            }
        }
        await sd.pause();
        graph.startAnimate().color(u.nodeId, C.grey).endAnimate();
        if (u.low === u.dfn) {
            await sd.pause();
            low.startAnimate().color(`low[${u.nodeId}]`, C.red).endAnimate();
            dfn.startAnimate().color(`dfn[${u.nodeId}]`, C.red).endAnimate();
            const col = colorList[SCC++];
            while (true) {
                const top = stk.lastElement();
                await sd.pause();
                top.startAnimate().color(col).endAnimate();
                const node = graph.element(top.intValue());
                node.startAnimate().color(col).endAnimate();
                await sd.pause();
                stk.startAnimate().erase(stk.end()).endAnimate();
                node.ins = false;
                if (top.intValue() === +u.nodeId) break;
            }
            await sd.pause();
            low.startAnimate().color(`low[${u.nodeId}]`, C.black).endAnimate();
            dfn.startAnimate().color(`dfn[${u.nodeId}]`, C.black).endAnimate();
        }
    }
    await tarjan(graph.findNodeById(1));
    focus.startAnimate().focus(null).endAnimate();
}