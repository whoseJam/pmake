import * as sd from "#lib/slide";

let svg = sd.svg();
let g = sd.Graph(svg);

g.newNode("skip1", sd.Text(g, "..."));
g.newNode("skip2", sd.Text(g, "..."));
g.newNode("skip3", sd.Text(g, "..."));
g.newNode("skip4", sd.Text(g, "..."));
g.newNode("skip5", sd.Text(g, "..."));
g.link("家", "skip1");
g.link("skip1", "A");
g.link("A", "skip2");
g.link("skip2", "B");
g.link("B", "skip3");
g.link("skip3", "C");
g.link("C", "skip4");
g.link("skip4", "D");
g.link("D", "skip5");
g.link("skip5", "家");
g.drag(true).resizeable(true);
g.cx(600).cy(300);
for (let i = 1; i <= 5; i++)
    g.element(`skip${i}`).background().strokeOpacity(0);

main();

async function main() {

}