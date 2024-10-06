import { Box } from "../Element/Box";
import { Vertex } from "../Element/Vertex";
import { d3TreeLayout, Tree } from "./Tree";

/**
 * @class RoundSquareTreee
 * @description 一棵圆方树
 */
export class RoundSquareTree extends Tree {
    constructor(node) {
        super(node);
        this.type("RoundSquareTree");
        this._.elementWidth = 40;
        this._.elementHeight = 40;
    }

    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        this._.elementWidth = width;
        this.dirty(this, "U");
        return this;
    }
    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        this.dirty(this, "U");
        return this;
    }

    root(id, nodeClass = Vertex, value = null) {
        if (id === undefined) {
            const nodes = this.member.get("nodes");
            return nodes.find(node => node.parentNodeId === undefined);
        }
        this.newNode(id, nodeClass, value);
        this.dirty(this, "U");
        return this;
    }
    newNode(id, nodeClass = Vertex, value = null) {
        let elem = new nodeClass(this);
        if (nodeClass === Box) elem.width(this._.elementWidth).height(this._.elementHeight);
        else elem.r(this._.r);
        if (value === null) elem.value(id);
        else elem.value(value);
        this.newNodeByTreeBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(this, "U");
        return this;
    }
    newRoundNode(id, value = null) {
        return this.newNode(id, Vertex, value);
    }
    newSquareNode(id, value = null) {
        return this.newNode(id, Box, value);
    }

    update() {
        return d3TreeLayout.call(
            this,
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            [1.5, 1.2, 1.2], 
            ["r", "elementWidth", "elementHeight"],
            ["r", "width", "height"]
        );
    }
}