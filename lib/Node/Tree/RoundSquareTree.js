import { Box } from "../Element/Box";
import { Vertex } from "../Element/Vertex";
import { Tree } from "./Tree";

/**
 * 使用方法：
 * t = RoundSquareTree(svg);
 * t.root(1, sd.Box);
 * t.newNode(2, sd.Vertex);
 * t.newLink(1, 2);
 * t.newNode(3, sd.Vertex);
 * t.newLink(1, 3);
 * 
 * t.newRoundNode(4);
 * t.newSquareNode(5);
 * t.newLink(3, 4);
 * t.newLink(3, 5);
 */

/**
 * @class RoundSquareTreee
 * @description 一棵圆方树
 */
export class RoundSquareTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "RoundSquareTree");
        this._.elementWidth = 40;
        this._.elementHeight = 40;
    }

    /**
     * 查询树的根的id，或者新建一个编号为id，价值为value的树根
     * @param {string|number|undefined} id 如果传入，则指定新建的树根的编号；否则代表查询树根编号
     * @param {Node|undefined} value 如果传入，则指定了新建树根的value 
     * @returns {Node|string} 当前节点，或者树根编号
     */
    root(id, nodeClass, value = null) {
        if (id === undefined) {
            const nodes = this._.nodes;
            return nodes.find(node => node.parentNodeId === undefined);
        }
        this.newNode(id, nodeClass, value);
        return this;
    }

    newNode(id, nodeClass, value = null) {
        let elem = new nodeClass(this);
        if (nodeClass === Box) elem.width(this._.elementWidth).height(this._.elementHeight);
        else elem.r(this._.r);
        if (value === null) elem.value(new Text(this, id));
        else elem.value(value);
        this.newNodeByTreeBase(id, elem);
        elem.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        }
        elem.events.enterFlag = true;
        return this;
    }

    newRoundNode(id, value = null) {
        return this.newNode(id, Vertex, value);
    }

    newSquareNode(id, value = null) {
        return this.newNode(id, Box, value);
    }
}