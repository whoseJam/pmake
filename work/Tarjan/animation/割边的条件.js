import * as sd from "@/sd";

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
    tree.link("u", "v");
    tree.update();
    attachSubtree("v");
}

async function main() {
    await sd.pause();
}