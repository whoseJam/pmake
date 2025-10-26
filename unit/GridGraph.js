import * as sd from "@/sd";

const svg = sd.svg();
const g = new sd.GridGraph(svg).x(100).y(100);

sd.init(() => {
    let eps = 0.2;
    g.n(3).m(4);
    g.at(2, 1).newNode(1);
    g.at(1, 2-eps).newNode(2);
    g.at(3, 2-eps).newNode(3);
    g.at(1, 3+eps).newNode(4);
    g.at(3, 3+eps).newNode(5);
    g.at(2, 4).newNode(6);
    
    link(1, 2);
    link(1, 3);
    link(2, 4);
    link(3, 5);
    link(4, 6);
    link(5, 6);
    function link(x, y) {
        g.newLink(x, y);
        g.element(x, y).arrow();
    }
})

sd.main(async () => {
    await sd.pause();
    g.startAnimate().at(1, 4).link(6, 7).endAnimate();
    await sd.pause();
    const v1 = new sd.Vertex(svg, "H").x(800).y(200);
    const v2 = new sd.Vertex(svg, "B").x(800).y(300);
    const l = new sd.Line(svg).source([900, 100]).target([950, 150]);
    await sd.pause();
    g.startAnimate().at(0, 0).newNodeFromExistElement(8, v1).link(1, 8).endAnimate();
    g.startAnimate().at(1, 0).newNodeFromExistElement(9, v2).newLinkFromExistElement(1, 9, l).endAnimate();
    
})