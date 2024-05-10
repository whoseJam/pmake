// @ts-check
import { Box } from "../Element/Box";
import { DAG } from "./DAG";
import { dagreGraphToBox } from "../../Utility/Tool";
import { trim } from "../../Utility/Trim";
import * as dagre from "dagre";

export class BoxDAG extends DAG {
    constructor(node) {
        super(node);
        this.g().attr("type", "BoxDAG");
        delete this._["r"];
        this._.elementWidth = 40;
        this._.elementHeight = 40;
    }

    /**
     * 操作图上节点的宽度
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        this._.elementWidth = width;
        this.dirty();
        return this;
    }

    /**
     * 操作图上节点的高度
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        this.dirty();
        return this;
    }

    newNode(id, value = null) {
        let elem = new Box(this.layer("vertex"));
        if (value !== null) elem.value(value);
        else elem.value(id);
        this.newNodeByGraphBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this._.graph.setNode(id, {
            label: id,
            width: this._.elementWidth,
            height: this._.elementHeight
        });
        this.dirty();
        return this;
    }

    update() {
        this.preUpdate();
        dagre.layout(this._.graph);
        const box = dagreGraphToBox(this._.graph);
        const realX = x => {
            if (box.width === 0) return this._.x;
            return this._.x + (x - box.x) / box.width * this._.width;
        }
        const realY = y => {
            if (box.height === 0) return this._.y;
            return this._.y + (y - box.y) / box.height * this._.height;
        }
        const elementWidth = this._.elementWidth;
        const elementHeight = this._.elementHeight;
        this._.graph.nodes().forEach(nodeId => {
            const node = this.findNodeById(nodeId);
            const layout = this._.graph.node(nodeId);
            const x = realX(layout.x);
            const y = realY(layout.y);
            const move = () => {
                node.width(elementWidth);
                node.height(elementHeight);
                node.cx(x).cy(y);
            }
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        });
        this._.graph.edges().forEach(linkInfo => {
            const x = linkInfo.v;
            const y = linkInfo.w;
            const link = this.findLinkById(x, y);
            const nx = this.findNodeById(x);
            const ny = this.findNodeById(y);
            const move = () => {
                link.source(nx.cx(), nx.cy());
                link.target(ny.cx(), ny.cy());
                trim(link, nx, ny);
            }
            if (link._.enter) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else move();
        });
        this.postUpdate();
        return this;
    }
}