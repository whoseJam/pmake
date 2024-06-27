import * as sd from "@/SD";

/**
 * 
 * @param {sd.GraphBase} graph 
 * @param {Array<{from: number|string, to: number|string}>} edges 
 */
export async function flow(graph, edges, gap = 40) {
    const svg = sd.svg();
    const C = sd.color();
    const R = sd.rule();
    await sd.pause();
    let current = 0, bottleNeck = Infinity;
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.after(current)
            .stroke(C.red).strokeWidth(2)
            .startAnimate().pointStoT().endAnimate();
        current = e;
        bottleNeck = Math.min(bottleNeck, e.intValue());
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`).fontSize(25).cx(graph.cx()).y(graph.my() + gap);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        const v = e.value();
        const newValue = e.intValue() - bottleNeck;
        v.startAnimate().opacity(0).endAnimate()
            .text(newValue)
            .startAnimate().opacity(1).endAnimate();
    })
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        if (!graph.element(edge.to, edge.from)) {
            graph.newLink(edge.to, edge.from);
            const re = graph.element(edge.to, edge.from);
            re.stroke(C.deepSkyBlue);
            re.startAnimate()
            re.value(bottleNeck, R.PointAtPathByRate(0.5, e.xloc, e.yloc))
            re.pointStoT()
            re.endAnimate();
            re.arrow();
        } else {
            const re = graph.element(edge.to, edge.from);
            const newValue = re.intValue() + bottleNeck;
            const v = re.value();
            v.startAnimate().opacity(0).endAnimate()
            v.text(newValue)
            v.startAnimate().opacity(1).endAnimate();
            if (newValue === bottleNeck) {
                re.startAnimate().strokeDashArray([re.totalLength(), 0]).endAnimate();
            }
        }
    })
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.startAnimate()
        e.strokeWidth(1).stroke(e.xloc ? C.black : C.deepSkyBlue);
        if (e.intValue() === 0) e.strokeDashArray([5, 5]);
        e.endAnimate();
    })
    text.startAnimate().opacity(0).remove();
}