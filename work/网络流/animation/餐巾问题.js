import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);

init();
main();

function init() {
    graph.at(0, 0.5).newNode("S");

    graph.at(0.33, 0).newNode("1");
    graph.at(0.33, 0.25).newNode("2");
    graph.at(0.33, 0.5).newNode("3");
    graph.at(0.33, 0.75).newNode("4");
    graph.at(0.33, 1).newNode("5");

    graph.at(0.66, 0).newNode("1'");
    graph.at(0.66, 0.25).newNode("2'");
    graph.at(0.66, 0.5).newNode("3'");
    graph.at(0.66, 0.75).newNode("4'");
    graph.at(0.66, 1).newNode("5'");

    graph.at(1, 0.5).newNode("T");

    function link(u, v, value, xloc, yloc, col = C.black) {
        graph.newLink(u, v);
        graph.element(u, v).arrow()
            .stroke(col)
            .value(value, R.PointAtPathByRate(0.5, xloc, yloc));
    }

    link("S", "3", "R/0", "x", "cy");
    link("3'", "T", "R/0", "x", "cy");
    link("3", "4'", "∞/f", "mx", "y");
    link("3", "5'", "∞/s", "x", "my");

}

async function main() {
    await sd.pause();
}