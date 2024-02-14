import { Box } from "../Element/Box";
import { Tree } from "./Tree";

export class BoxTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "BoxTree");
        delete this._["r"];
        this._.elementWidth = 60;
        this._.elementHeight = 40;
    }

    /**
     * 新建一个编号为id，价值为value的节点，如果价值未指定，则默认为id，随后交由TreeBase完成信息的存储工作和update的工作
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Box(this);
        if (value === null) elem.value(new Text(this, id));
        else elem.value(value);
        super.newNodeByTreeBase(id, elem);
        return this;
    }
}