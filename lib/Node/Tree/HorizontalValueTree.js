import { HorizontalTree } from "./HorizontalTree";
import { trim } from "../../Utility/Trim";
import * as d3 from "d3";

export class HorizontalValueTree extends HorizontalTree {
    constructor(node) {
        super(node);
        this.g().type("HorizontalValueTree");
        delete this._["r"];
    }

    /**
     * 新建一个编号为id，价值为value的节点，价值必须是一个节点
     * @param {string|number} id 
     * @param {Node} value 
     * @returns 当前节点
     */
    newNode(id, value) {
        this.newNodeByTreeBase(id, value);
        value.attachTo(this);
        value._.enter = (elem, move) => {
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
        this._.width = hierarchy.height * this.layerWidth();
        let tr = d3.tree().size([this._.height, this._.width]);
        const info = tr(hierarchy);

        const transX = node => node.y + this.x();
        const transY = node => node.x + this.y();
        info.descendants().forEach(nodeInfo => {
            const x = transX(nodeInfo);
            const y = transY(nodeInfo);
            const node = nodeInfo.data.data;
            const move = () => { node.cx(x).cy(y); }
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
                link.source(transX(source), transY(source));
                link.target(transX(target), transY(target));
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