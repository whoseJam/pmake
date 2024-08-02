import { Tree } from         "@/Node/Tree/Tree";
import { d3TreeLayout } from "@/Node/Tree/Tree";

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
    const element = value;
    value._.enter = (element, move) => {
        element.attachTo(this.layer("nodes"));
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    };
    this.newNodeByBaseTree(id, element);
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