import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {
    sd.freeze();
    makeComplexGraph();
    sd.unfreeze();
});

sd.main(async () => {
    await sd.pause();
});

function makeComplexGraph() {
    const graph = new sd.DAG(svg).cx(600).cy(300);
    const tree = makeComplexTree();
    console.log(tree.width(), tree.height());
    graph.newNode(1, tree);
    graph.element(1).r(80);
    graph.newNode(2, makeVertex());
    graph.newNode(3, makeGrid());
    graph.newNode(4, makeArray());
    graph.link(1, 2).link(1, 3).link(2, 3).link(3, 4);
    return graph;
}

function makeComplexTree() {
    const tree = new sd.Tree(svg).width(60).layerHeight(120).freeze();
    tree.root(1, makeGrid());
    tree.newNode(2, makeArray());
    tree.newNode(3, makeGrid());
    tree.newNode(4, makeVertex());
    tree.newNode(5, makeGrid());
    tree.link(1, 2).link(1, 3).link(2, 4).link(3, 5).unfreeze();
    return tree;
}

function makeVertex() {
    return new sd.Vertex(svg).value(makeGrid());
}

function makeGrid() {
    const grid = new sd.Grid(svg);
    grid.insert(0, 0, makeArray()).insert(0, 1, makeArray()).insert(0, 2, new sd.Circle(svg));
    grid.insert(1, 0, "hello").insert(1, 1, "world");
    return grid;
}

function makeArray() {
    return new sd.Array(svg).resize(3);
}
