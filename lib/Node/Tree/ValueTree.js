import { Tree } from "./Tree";
import { trim } from "../../Utility/Trim";
import * as d3 from "d3";

export class ValueTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueTree");
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
        value.attachTo(this.layer("vertex"));
        value._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
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
        info.descendants().forEach(node => {
            const x = transX(node.x);
            const y = transY(node.y);
            node = node.data.data;
            const move = () => { node.cx(x).cy(y); }
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else {
                node.startAnimate(this);
                move();
            }
        });
        info.links().forEach(link => {
            let source = link.source;
            let target = link.target;
            let src = source.data.id;
            let tgt = target.data.id;
            link = this.findLinkById(src, tgt);
            if (!link) return;
            const move = () => {
                link.source(transX(source.x), transY(source.y));
                link.target(transX(target.x), transY(target.y));
                trim(link, this.findNodeById(src), this.findNodeById(tgt));            
            }
            if (link._.enter) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else {
                link.startAnimate(this);
                move();
            }
        });
        this.postUpdate();
        return this;
    }
}