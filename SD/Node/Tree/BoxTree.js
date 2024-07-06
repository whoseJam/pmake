import { Box } from "@/Node/Element/Box";
import { D3Layer } from "@/Node/D3Layer";
import { d3TreeLayout } from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
import { naiveGetterAndSetter } from "../Common";

export function BoxTree(parent) {
    Tree.call(this, parent);

    this.g().type("BoxTree");

    this._.nodeType = Box;
    this.member.new("elementWidth", 60);
    this.member.new("elementHeight", 40);

    return this;
}

BoxTree.prototype = {
    ...Tree.prototype
};

BoxTree.prototype.elementWidth  = naiveGetterAndSetter("elementWidth", "setByEqual");
BoxTree.prototype.elementHeight = naiveGetterAndSetter("elementHeight", "setByEqual");

BoxTree.prototype.updateList = [
    ...BoxTree.prototype.updateList.slice(0, -1),
    update
];

function update() {
    return d3TreeLayout.call(
        this,
        "vertical",
        node => node.x + this.x(),
        node => node.y + this.y(),
        [1.5, 1.5], 
        ["elementWidth", "elementHeight"],
        ["width", "height"]);
}