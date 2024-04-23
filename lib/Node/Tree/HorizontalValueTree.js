import { HorizontalTree } from "./HorizontalTree";

export class HorizontalValueTree extends HorizontalTree {
    constructor(node) {
        super(node);
        this.g().attr("type", "HorizontalValueTree");
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
        value.attachTo(this);
        value.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        value.events.enterFlag = true;
        return this;
    }
}