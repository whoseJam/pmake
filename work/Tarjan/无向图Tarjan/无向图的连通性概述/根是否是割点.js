import * as sd from "@/sd";

const svg = sd.svg();
const layer = svg.append("g");
const tree1 = new sd.Tree(svg).x(100);
const tree2 = new sd.Tree(svg).x(500);

sd.init(() => {
    function attachSubtree(tree, u) {
        const element = tree.element(u);
        const rect = new sd.Rect(layer);
        svg.children.push(rect);
        rect.width(60);
        rect.height(80);
        rect.cx(element.cx());
        rect.y(element.cy());
    }
    tree1.root("r");
    tree1.link("r", "a");
    tree1.update();
    attachSubtree(tree1, "a");
    tree2.root("r");
    tree2.link("r", "a");
    tree2.link("r", "b");
    tree2.update();
    attachSubtree(tree2, "a");
    attachSubtree(tree2, "b");
});

sd.main(async () => {});
