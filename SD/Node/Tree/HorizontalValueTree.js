import { d3TreeLayout } from "@/Node/Tree/Tree";
import { HorizontalTree } from "@/Node/Tree/HorizontalTree";
import { ValueTree } from "@/Node/Tree/ValueTree";

/**
 * @class HorizontalValueTree
 */
export class HorizontalValueTree extends HorizontalTree {
    constructor(node) {
        super(node);
        this.g().type("HorizontalValueTree");
        delete this._["r"];
    }

    /**
     * 新建一个编号为id，价值为value的节点，价值必须是一个节点
     * @param {string|number} id 
     * @param {Node} value 
     * @returns 当前节点
     */
    newNode(id, value) {
        return ValueTree.prototype.newNode.call(this, id, value);
    }

    update() {
        return d3TreeLayout.call(
            this,
            "horizontal",
            node => node.y + this.x(),
            node => node.x + this.y(),
            [], [], []
        )
    }
}