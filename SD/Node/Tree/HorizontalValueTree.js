import { d3TreeLayout } from "@/Node/Tree/Tree";
import { HorizontalTree } from "@/Node/Tree/HorizontalTree";
import { ValueTree } from "@/Node/Tree/ValueTree";

export function HorizontalValueTree(parent) {
    HorizontalTree.call(this, parent);

    this.g().type("HorizontalValueTree");

    this.member.new("layerWidth", 60);

    return this;
}

HorizontalValueTree.prototype = {
    ...HorizontalTree.prototype
};

HorizontalValueTree.prototype.newNode = ValueTree.prototype.newNode;

HorizontalValueTree.prototype.updateList = [
    ...HorizontalValueTree.prototype.updateList.slice(0, -1),
    update
];

function update() {
    console.log("start HorizontalValueTree update");
    return d3TreeLayout.call(
        this,
        "horizontal",
        node => node.y + this.x(),
        node => node.x + this.y(),
        [], [], []
    )
}