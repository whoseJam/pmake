import { Tree }     from "@/Node/Tree/Tree";
import { Enter }    from "@/Node/SDNode/Enter";
import { D3Layout } from "@/Node/Tree/Tree";

export function ValueTree(parent) {
    Tree.call(this, parent);

    this.type("ValueTree");
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
    element.onEnter(Enter.ordinary(this, "nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
}

ValueTree.prototype.newNodeFromExistValue = Tree.prototype.newNodeFromExistElement;

function update() {
    D3Layout.apply(this, [
        "vertical",
        node => node.x + this.x(),
        node => node.y + this.y(),
        () => {}
    ]);
}