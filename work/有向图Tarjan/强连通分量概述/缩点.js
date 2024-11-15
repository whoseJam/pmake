import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.ValueGridGraph(svg).width(250).height(200);
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow];
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

    })
})

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= 5; i++) {
        grid.element(i).startAnimate().color(colorList[i - 1]).endAnimate();
    }
    await sd.pause();
    for (let i = 1; i <= 5; i++) {
        const graph = grid.element(i);
        Compress(graph);
        const circle = new sd.Circle(svg);
        circle.r(graph.width() / 2);
        circle.center(graph.center());
        circle.fillOpacity(0).opacity(0);
        graphs[i].circle = circle;
    }
    await sd.pause();
    for (let i = 1; i <= 5; i++) {
        const circle = graphs[i].circle;
        circle.startAnimate().opacity(1).endAnimate();
    }
    await sd.pause();
    externLinks.forEach(link => {
        const l = link[3].link;
        l.startAnimate();
        l.sourceElement(graphs[link[0][0]].circle);
        l.targetElement(graphs[link[1][0]].circle);
        l.endAnimate();
    })
})

function Compress(graph) {
    graph.startAnimate();
    graph.forEachNodes((node) => node.r(10));
    const center = graph.center();
    graph.scale(0.5);
    graph.center(center);
    graph.endAnimate();
}

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