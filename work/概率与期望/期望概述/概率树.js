import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const tree = new sd.Tree(svg);
const nodes = [2, 1, 3, 2, 1];
const n = nodes.length;
const links = [
    [1, 2, "\\frac{1}{3}", "mx"],
    [1, 3, "\\frac{2}{3}", "x"],
    [2, 4, "\\frac{1}{2}", "mx"],
    [2, 5, "\\frac{1}{2}", "x"],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) tree.newNode(i, nodes[i - 1]);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).value(new sd.Mathjax(svg, link[2]).fontSize(10), R.pointAtPathByRate(0.5, link[3], "my"));
    });
});

sd.main(async () => {});
