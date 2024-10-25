import { D3Layout }       from "@/Node/Tree/Tree";
import { ValueTree }      from "@/Node/Tree/ValueTree";
import { HorizontalTree } from "@/Node/Tree/HorizontalTree";

export function HorizontalValueTree(parent) {
    HorizontalTree.call(this, parent);

    this.type("HorizontalValueTree");

    this.member.new("layerWidth", 60);
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
    D3Layout.apply(this, [
        "horizontal",
        node => node.y + this.x(),
        node => node.x + this.y(),
        () => {}
    ]);
}