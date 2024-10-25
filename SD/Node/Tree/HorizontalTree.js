import { Tree }     from "@/Node/Tree/Tree";
import { SDNode }   from "@/Node/SDNode";
import { D3Layout } from "@/Node/Tree/Tree";


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
    if (this.member.hasChanged("nodes") ||
        this.member.hasChanged("links") ||
        this.member.hasChanged("r") ||
        this.member.hasChanged("height") ||
        this.member.hasChanged("layerWidth")) {
        const r = this.member.get("r");
        D3Layout.apply(this, [
            "horizontal",
            node => node.y + this.x(),
            node => node.x + this.y(),
            (node, limit) => node.r(Math.min(r, limit / 2.1))
        ]);
        this.member.flush("nodes");
        this.member.flush("links");
        this.member.flush("r");
        this.member.flush("height");
        this.member.flush("layerWidth");
    }
}