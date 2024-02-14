import { Tree } from "./Tree";

export class ValueTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueTree");
        delete this._["r"];
    }

    /**
     * 新建一个编号为id，价值为value的节点，价值必须是一个节点
     * @param {string|number} id 
     * @param {Node} value 
     * @returns 当前节点
     */
    newNode(id, value) {
        super.newNodeByTreeBase(id, value);
        return this;
    }
}