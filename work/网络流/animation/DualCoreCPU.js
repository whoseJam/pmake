import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).cx(600).cy(300);
const R = sd.rule();
const links = [
    { from: "S", to: "i", cap: "a_i", xloc: "mx", yloc: "my" },
    { from: "S", to: "j", cap: "a_j", xloc: "mx", yloc: "y" },
    { from: "i", to: "j", cap: "w_{i,j}", xloc: "x", yloc: "cy" },
    { from: "i", to: "T", cap: "b_i", xloc: "x", yloc: "my" },
    { from: "j", to: "T", cap: "b_j", xloc: "x", yloc: "y" }
];

init();
main();

function init() {
    graph.at(0.5, 0).newNode("S");
    graph.at(0, 0.5).newNode("i");
    graph.at(1, 0.5).newNode("j");
    graph.at(0.5, 1).newNode("T");
    function link(x, y) {
        graph.newLink(x, y);
    }
    links.forEach(lk => {
        link(lk.from, lk.to);
        const e = graph.element(lk.from, lk.to).arrow();
        const math = new sd.Mathjax(e, lk.cap);
        math.height(math.height() * 2);
        e.value(math, R.pointAtPathByRate(0.5, lk.xloc, lk.yloc));
        e.xloc = lk.xloc;
        e.yloc = lk.yloc;
    });
    graph.element("i", "j").doubleArrow();
}

async function main() {
    await sd.pause();
}