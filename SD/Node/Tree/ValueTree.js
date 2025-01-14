import { Enter as EN } from "@/Node/Core/Enter";
import { effect, uneffect } from "@/Node/Core/Reactive";
import { D3Layout, Tree } from "@/Node/Tree/Tree";

export function ValueTree(parent) {
    Tree.call(this, parent);

    this.type("ValueTree");

    uneffect(this._.updater);
    this._.updater = effect(() => {
        D3Layout.apply(this, ["vertical", node => [node.x + this.x(), node.y + this.y()], () => {}]);
    });
}

ValueTree.prototype = {
    ...Tree.prototype,
};

ValueTree.prototype.newNode = function (id, value) {
    const element = value;
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
};

ValueTree.prototype.newNodeFromExistValue = Tree.prototype.newNodeFromExistElement;
