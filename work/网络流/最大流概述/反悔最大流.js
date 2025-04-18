import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).cx(600).cy(300);
const links = [
    // format: x y capacity
    [1, 2, 4, "mx", "my"],
    [1, 3, 2, "x", "my"],
    [2, 3, 1, "cx", "my"],
    [2, 4, 2, "mx", "cy"],
    [2, 5, 4, "x", "y"],
    [3, 5, 2, "x", "cy"],
    [4, 6, 3, "mx", "y"],
    [5, 6, 3, "x", "y"],
];

sd.init(() => {
    graph.at(0, 0.5).newNode(1, "A");
    graph.at(0.25, 0).newNode(2, "B");
    graph.at(0.25, 1).newNode(3, "C");
    graph.at(0.75, 0).newNode(4, "D");
    graph.at(0.75, 1).newNode(5, "E");
    graph.at(1, 0.5).newNode(6, "F");
    links.forEach(link => {
        const rule = R.pointAtPathByRate(0.5, link[3], link[4]);
        const math = new sd.Mathjax(svg, link[2]).fontSize(20);
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).arrow().value(math, rule);
    });
    graph._.linkType = sd.Curve;
});

sd.main(async () => {
    await flowWithRegret(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 5 },
        { from: 5, to: 6 },
    ]);
    await flowWithRegret(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 4, to: 6 },
    ]);
    await flowWithRegret(graph, [
        { from: 1, to: 3 },
        { from: 3, to: 5 },
        { from: 5, to: 2 },
        { from: 2, to: 4 },
        { from: 4, to: 6 },
    ]);
});

async function flowWithRegret(graph, path) {
    const svg = sd.svg();
    const C = sd.color();
    await sd.pause();
    let timestamp = 0;
    let bottleNeck = Infinity;
    const cloned = [];
    path.forEach(segment => {
        const link = graph.element(segment.from, segment.to);
        const clone = new sd.Line(svg).source(link.source()).target(link.target()).opacity(0);
        clone.after(timestamp).opacity(1).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate().arrow();
        timestamp = clone;
        bottleNeck = Math.min(bottleNeck, link.intValue());
        cloned.push(clone);
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`)
        .fontSize(25)
        .cx(graph.cx())
        .y(graph.my() + 40);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    path.forEach((segment, i) => {
        const link = graph.element(segment.from, segment.to);
        const linkValue = link.value();
        console.log("linkValue=", linkValue, "from=", segment.from, "to=", segment.to);
        const remainCapacity = linkValue.intValue() - bottleNeck;
        linkValue.after(timestamp).startAnimate().transformMath(remainCapacity).endAnimate();
        if (link.intValue() === 0) link.after(timestamp).startAnimate().strokeDashArray([5, 5]).endAnimate();
        cloned[i].after(timestamp).startAnimate().fadeStoT().endAnimate().remove();
        timestamp = cloned[i];
    });
    await sd.pause();
    path.forEach(segment => {
        const link = graph.element(segment.from, segment.to);
        let reversedLink = graph.element(segment.to, segment.from);
        if (!reversedLink) {
            const rule = R.pointAtPathByRate(0.5, "cx", "cy");
            graph.newLink(segment.to, segment.from);
            reversedLink = graph.element(segment.to, segment.from);
            reversedLink.stroke(C.deepSkyBlue);
            reversedLink.startAnimate();
            reversedLink.value(bottleNeck, rule).endAnimate();
            reversedLink.pointStoT();
            reversedLink.endAnimate();
            reversedLink.arrow();
        } else {
            const remainCapacity = reversedLink.intValue() + bottleNeck;
            reversedLink.value().startAnimate().transformMath(remainCapacity).endAnimate();
        }
    });
    await sd.pause();
    // path.forEach(segment => {
    //     const link = graph.element(segment.from, segment.to);
    //     link.startAnimate();
    //     // link.strokeWidth(1).stroke

    // })
    // edges.forEach(edge => {
    //     const e = graph.element(edge.from, edge.to);
    //     e.startAnimate();
    //     e.strokeWidth(1).stroke(e.xloc ? C.black : C.deepSkyBlue);
    //     if (e.intValue() === 0) e.strokeDashArray([5, 5]);
    //     e.endAnimate();
    // });
    text.startAnimate().opacity(0).remove();
}
