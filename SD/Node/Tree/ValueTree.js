import { Enter as EN } from "@/Node/Core/Enter";
import { Tree } from "@/Node/Tree/Tree";

export class ValueTree extends Tree {
    constructor(target) {
        super(target);

        this.type("ValueTree");
    }
}

Object.assign(ValueTree.prototype, {
    newNode(id, value) {
        const element = value;
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistValue: Tree.prototype.newNodeFromExistElement,
});
