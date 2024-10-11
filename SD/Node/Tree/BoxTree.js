import { Box }             from "@/Node/Element/Box";
import { Tree }            from "@/Node/Tree/Tree";
import { d3TreeLayout }    from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";

export function BoxTree(parent) {
    Tree.call(this, parent);

    this.type("BoxTree");

    this._.nodeType = Box;
    this.member.new("elementWidth", 60);
    this.member.new("elementHeight", 40);
}

BoxTree.prototype = {
    ...Tree.prototype
};

BoxTree.prototype.elementWidth  = SDNode.OrdinaryGSet("elementWidth", "setByEqual");
BoxTree.prototype.elementHeight = SDNode.OrdinaryGSet("elementHeight", "setByEqual");

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