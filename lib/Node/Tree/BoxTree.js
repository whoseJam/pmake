import { Box } from "../Element/Box";
import { Tree } from "./Tree";
import { SDNode } from "../Node";
import { trim } from "../../Utility/Trim";
import { Vec } from "../../Utility/Math";
import * as d3 from "d3";

export class BoxTree extends Tree {
    /**
     * @constructor
     * @param {SDNode} node 
     */
    constructor(node) {
        super(node);
        this.g().attr("type", "BoxTree");
        delete this._["r"];
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
        this.dirty(this, "U");
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
        this.dirty(this, "U");
        return this;
    }

    /**
     * @override
     */
    newNode(id, value = null) {
        let elem = new Box(this.layer("vertex"));
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

    update() {
        this.preUpdate();
        let rt;
        try {
            rt = d3.stratify()
            rt.id(d => d["nodeId"])
            rt.parentId(d => d["parentNodeId"])
            rt = rt(this._.nodes);
        } catch(error) { return this; }
        const hierarchy = d3.hierarchy(rt);
        this._.height = hierarchy.height * this.layerHeight();
        let tr = d3.tree().size([this._.width, this._.height]);
        const info = tr(hierarchy);

        const transX = x => x + this.x();
        const transY = y => y + this.y();
        let rlimit = Infinity;
        const descendants = info.descendants(); 
        for (let i = 0; i < descendants.length; i++) {
            /** @type {import("../../Utility/Math").Vector} */
            const vecI = [transX(descendants[i].x), transY(descendants[i].y)];
            for (let j = i + 1; j < descendants.length; j++) {
                /** @type {import("../../Utility/Math").Vector} */
                const vecJ = [transX(descendants[j].x), transY(descendants[j].y)];
                rlimit = Math.min(rlimit, Vec.length(Vec.sub(vecI, vecJ)) / 1.5);
            }
        }
        const elementWidth = Math.min(rlimit, this._.elementWidth);
        const elementHeight = Math.min(rlimit, this._.elementHeight);
        info.descendants().forEach(nodeInfo => {
            const x = transX(nodeInfo.x);
            const y = transY(nodeInfo.y);
            const node = nodeInfo.data.data;
            const move = () => { node.width(elementWidth).height(elementHeight).cx(x).cy(y); }
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        });
        info.links().forEach(linkInfo => {
            const source = linkInfo.source;
            const target = linkInfo.target;
            const src = source.data.id;
            const tgt = target.data.id;
            const link = this.findLinkById(src, tgt);
            if (!link) return;
            const move = () => {
                link.source(transX(source.x), transY(source.y));
                link.target(transX(target.x), transY(target.y));
                trim(link, this.findNodeById(src), this.findNodeById(tgt));            
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