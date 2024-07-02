import { D3Layer } from "@/Node/D3Layer";
import { d3TreeLayout } from "@/Node/Tree/Tree";
import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";

/**
 * @class HorizontalTree
 */
export class HorizontalTree extends Tree {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("HorizontalTree")
        this._.width = 0;
        this._.height = 300;
        this._.layerWidth = 60;
        delete this._["layerHeight"];
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        const depth = this.depth();
        this.layerWidth(width / depth);
        this.dirty(this, "R");
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck("q");
        if (height === undefined) return this._.height;
        this._.height = height;
        this.dirty(this, "R");
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    layerWidth(width) {
        this.dirtyCheck("q");
        if (width === undefined) return this._.layerWidth;
        this._.layerWidth = width;
        this.dirty(this, "R");
        return this;
    }

    update() {
        return d3TreeLayout.call(
            this,
            "horizontal",
            node => node.y + this.x(),
            node => node.x + this.y(),
            [2.1], ["r"], ["r"]);
    }
}