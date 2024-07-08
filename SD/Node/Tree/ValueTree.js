import { d3TreeLayout } from "@/Node/Tree/Tree";
import { Tree } from "@/Node/Tree/Tree";

export function ValueTree(parent) {
    Tree.call(this, parent);

    this.g().type("ValueTree");

    return this;
}

ValueTree.prototype = {
    ...Tree.prototype
};

ValueTree.prototype.updateList = [
    ...Tree.prototype.updateList.slice(0, -1),
    update
];

ValueTree.prototype.newNode = function(id, value) {
    const elem = value;
    value._.enter = (elem, move) => {
        console.log("elem=", elem, "move=", move);
        elem.attachTo(this.layer("nodes"));
        elem.opacity(0);
        move();
        elem.freeze().unfreeze();
        elem.startAnimate(this);
        elem.opacity(1);
    };
    this.newNodeByBaseTree(id, elem);
    return this;
}

function update() {
    return d3TreeLayout.call(
        this,
        "vertical",
        node => node.x + this.x(),
        node => node.y + this.y(),
        [], [], []
    );
}