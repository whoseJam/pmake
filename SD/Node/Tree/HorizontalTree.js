import { d3TreeLayout } from "@/Node/Tree/Tree";

import { Tree }   from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";

export function HorizontalTree(parent) {
    Tree.call(this, parent);

    this.type("HorizontalTree");

    this.member.set("width", 0);
    this.member.set("height", 300);
    this.member.new("layerWidth", 60);
}

HorizontalTree.prototype = {
    ...Tree.prototype
};

HorizontalTree.prototype.height     = SDNode.OrdinaryGSet("height", "setByEqual");
HorizontalTree.prototype.layerWidth = SDNode.OrdinaryGSet("layerWidth", "setByEqual");
HorizontalTree.prototype.width = function(width) {
    if (width === undefined) {
        return this.member.get("width");
    }
    const depth = this.depth();
    this.layerWidth(width / depth);
    return this;
}

HorizontalTree.prototype.updateList = [
    ...HorizontalTree.prototype.updateList.slice(0, -1),
    update
];

function update() {
    return d3TreeLayout.call(
        this,
        "horizontal",
        node => node.y + this.x(),
        node => node.x + this.y(),
        [2.1], ["r"], ["r"]);
}