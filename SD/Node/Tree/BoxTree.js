import { Box } from "@/Node/Element/Box";
import { D3Layer } from "@/Node/D3Layer";
import { d3TreeLayout } from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";

/**
 * @class BoxTree
 */
export class BoxTree extends Tree {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("BoxTree");
        delete this._["r"];
        this._.nodeType = Box;
        this._.elementWidth = 60;
        this._.elementHeight = 40;
    }

    /**
     * 操作树上节点的宽度
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        this._.elementWidth = width;
        this.dirty(this, "R");
        return this;
    }

    /**
     * 操作树上节点的高度
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        this.dirty(this, "R");
        return this;
    }

    update() {
        return d3TreeLayout.call(
            this,
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            [1.5, 1.5], 
            ["elementWidth", "elementHeight"],
            ["width", "height"]);
    }
}