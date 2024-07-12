import * as sd from "@/sd";

/**
 * @param {sd.GridGraph} graph 
 * @param {Array<string>} nodesId 
 */
export function 有向图Tarjan(graph, nodesId) {
    let tot = 0, SCC = 0;
    const stk = [];
    const tarjan = (u) => {
        u.dfn = u.low = ++tot;
        stk.push(u); u.ins = true;

        const outs = graph.outNodes(u.nodeId);
        for (let v of outs) {
            if (!v.dfn) {
                tarjan(v);
                u.low = Math.min(u.low, v.low);
            } else if (v.ins) u.low = Math.min(u.low, v.dfn);
        }
        if (u.dfn === u.low) {
            SCC++;
            while (stk.length > 0) {
                const t = stk.pop();
                t.bel = SCC;
                t.ins = false;
                if (t === u) break;
            }
        }
    }

    nodesId.forEach((nodeId) => {
        const node = graph.findNodeById(nodeId);
        if (!node.dfn) tarjan(node);
    })
}