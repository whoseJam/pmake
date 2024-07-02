import { D3Layer } from "../D3Layer";
import { d3TreeLayout } from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";

/**
 * @class ValueTree
 */
export class ValueTree extends Tree {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("ValueTree");
        delete this._["r"];
    }

    /**
     * 新建一个编号为id，价值为value的节点，价值必须是一个节点
     * @param {number|string} id 
     * @param {SDNode} value 
     * @returns 当前节点
     */
    newNode(id, value) {
        const elem = value;
        value._.enter = (elem, move) => {
            elem.attachTo(this.layer("vertex"));
            elem.opacity(0);
            move();
            elem.startAnimate(this);
            elem.opacity(1);
        };
        this.dirty(this, "R")
        this.newNodeByTreeBase(id, elem);
        return this;
    }

    update() {
        return d3TreeLayout.call(
            this,
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            [], [], []
        );
    }
}