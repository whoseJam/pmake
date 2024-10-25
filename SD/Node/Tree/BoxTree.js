import { Box }      from "@/Node/Element/Box";
import { Tree }     from "@/Node/Tree/Tree";
import { SDNode }   from "@/Node/SDNode";
import { D3Layout } from "@/Node/Tree/Tree";

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
    if (this.member.hasChanged("nodes") ||
        this.member.hasChanged("links") ||
        this.member.hasChanged("elementWidth") || 
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("width") ||
        this.member.hasChanged("layerHeight")) {
        const w = this.member.get("elementWidth");
        const h = this.member.get("elementHeight");
        D3Layout.apply(this, [
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            (node, limit) => {
                node.width(Math.min(w, limit / 1.5));
                node.height(Math.min(h, limit / 1.5));
            }
        ]);
        this.member.flush("nodes");
        this.member.flush("links");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("width");
        this.member.flush("layerHeight");
    }
}