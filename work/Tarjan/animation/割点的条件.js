import * as sd from "@/SD";

const svg = sd.svg();
const layer = svg.append("g");
const tree = new sd.Tree(svg);

init();
main()

function init() {
    function attachSubtree(u) {
        const element = tree.element(u);
        const rect = new sd.Rect(layer);
        svg.children.push(rect);
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
    tree.update();
    attachSubtree("a");
    attachSubtree("b");
    attachSubtree("c");
}

async function main() {
    await sd.pause();
}