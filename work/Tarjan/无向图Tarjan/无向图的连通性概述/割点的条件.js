import * as sd from "@/sd";

const svg = sd.svg();
const layer = svg.append("g");
const tree = new sd.Tree(svg);

sd.init(() => {
    function attachSubtree(u) {
        const element = tree.element(u);
        const rect = new sd.Rect(layer);
        rect.width(60);
        rect.height(80);
        rect.cx(element.cx());
        rect.y(element.cy());
    }
    tree.root("f");
    tree.link("f", "u");
    tree.link("u", "a");
    tree.link("u", "b");
    tree.link("u", "c");
    attachSubtree("a");
    attachSubtree("b");
    attachSubtree("c");
});

sd.main(async () => {});
