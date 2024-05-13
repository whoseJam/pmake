import * as sd from "../../../lib/slide";

/**
 * @param {sd.GraphBase} graph 
 */
export async function floyd(graph) {
    const C = sd.color();
    const R = sd.rule();
    const nodes = graph.nodes();
    const links = graph.links();
    const n = nodes.length;
    const data = sd.make2d(n+1, n+1, Infinity);
    nodes.forEach((node, idx) => {
        node.idx = idx;
    });
    const map = new sd.Grid(graph).n(n).m(n).startN(1).startM(1);
    sd.Index(map, "t");
    sd.Index(map, "l");
    graph.childAs("map", map, R.Aside("rc", 60));
    links.forEach((link) => {
        const x = +link.fromNodeId;
        const y = +link.toNodeId;
        data[x][y] = Math.min(data[x][y], +link.value().text());
    });
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++)
            if (i !== j) map.value(i, j, data[i][j]);
            else map.value(i, j, 0);

    for (let k = 1; k <= n; k++) {
        const ek = graph.element(k);
        await sd.pause();
        graph.startAnimate().color(k, C.blue).endAnimate();
        for (let i = 1; i <= n ; i++) {
            const ei = graph.element(i);
            for (let j = 1; j <= n; j++) {
                const ej = graph.element(j);

                const dij = map.intValue(i, j);
                const dik = map.intValue(i, k);
                const dkj = map.intValue(k, j);
                if (dij > dik + dkj) {
                    await sd.pause();
                    const lij = sd.Link(ei, ej, sd.Curve).stroke(C.red).startAnimate().pointStoT().endAnimate().arrow();
                    const lik = sd.Link(ei, ek, sd.Curve).stroke(C.green).startAnimate().pointStoT().endAnimate().arrow();
                    const lkj = sd.Link(ek, ej, sd.Curve).stroke(C.green).startAnimate().pointStoT().endAnimate().arrow();
                    await sd.pause();
                    map.startAnimate().value(i, j, dik + dkj).endAnimate();
                    await sd.pause();
                    lij.startAnimate().fadeStoT().endAnimate().arrow(false);
                    lik.startAnimate().fadeStoT().endAnimate().arrow(false);
                    lkj.startAnimate().fadeStoT().endAnimate().arrow(false);
                }
            }
        }
        await sd.pause();
        graph.startAnimate().color(k, C.white).endAnimate();
    }
}