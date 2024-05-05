import { Tree } from "./Tree";
import { trim } from "../../Utility/Trim";
import { Vec } from "../../Utility/Math";
import * as d3 from "d3";
import { Const } from "../../Utility/Const";

export class HorizontalTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "HorizontalTree")
        this._.width = 0;
        this._.height = 300;
        this._.layerWidth = 60;
        delete this._["layerHeight"];
    }

    // --------------------位置函数--------------------
    width(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        const depth = this.depth();
        this.layerWidth(width / depth);
        this.dirty(Const.DirtyChannel.width);
        return this;
    }
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        this._.height = height;
        this.dirty();
        return this;
    }
    layerWidth(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.layerWidth;
        this._.layerWidth = width;
        this.dirty();
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
        let rlimit = Infinity;
        const descendants = info.descendants(); 
        for (let i = 0; i < descendants.length; i++) {
            const vecI = [transX(descendants[i]), transY(descendants[i])];
            for (let j = i + 1; j < descendants.length; j++) {
                const vecJ = [transX(descendants[j]), transY(descendants[j])];
                rlimit = Math.min(rlimit, Vec.length(Vec.sub(vecI, vecJ)) / 2.1);
            }
        }
        rlimit = Math.min(rlimit, this._.r);
        info.descendants().forEach(node => {
            const x = transX(node);
            const y = transY(node);
            node = node.data.data;
            const move = () => { node.r(rlimit).cx(x).cy(y); }
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
                link.source(transX(source), transY(source));
                link.target(transX(target), transY(target));
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