import * as sd from "@/sd";

const svg = sd.svg();
const n = 6;
const nodes = new sd.ValueArray(svg);

sd.init(() => {
    for (let i = 1; i <= n; i++) nodes.push(new sd.Vertex(nodes, i));
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = i + 1; j <= n; j++) {
            sd.Link(nodes[i], nodes[j], sd.Curve).startAnimate().pointStoT().endAnimate();
        }
    }
    await sd.pause();
    const S = new sd.Vertex(svg, "S")
        .cx(nodes.cx())
        .my(nodes.y() - 60)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        sd.Link(S, nodes[i]).startAnimate().pointStoT().endAnimate();
    }
    new sd.Mathjax(svg, "v_i")
        .x(nodes.x())
        .cy((nodes.y() + S.my()) / 2)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
});
