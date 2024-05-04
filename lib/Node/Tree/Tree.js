import { TreeBase } from "./TreeBase";
import { trim } from "../../Utility/Trim";
import { Vertex } from "../Element/Vertex";
import { Line } from "../Basic/Line";
import { Const } from "../../Utility/Const";
import { Vec } from "../../Utility/Math";
import * as d3 from "d3";

export class Tree extends TreeBase {
    constructor(node) {
        super(node)
        this.g().attr("type", "Tree");
        this.newLayer("vertex");
        this.newLayer("link");
        this._.r = 20;
        this._.width = 300;
        this._.height = 0;
        this._.layerHeight = 60;
    }

    // --------------------位置函数--------------------
    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        this._.width = width;
        this.dirty();
        return this;
    }
    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        const depth = this.depth();
        this.layerHeight(height / depth);
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    r(r) {
        this.dirtyCheck();
        if (r === undefined) return this._.r;
        this._.r = r;
        this.dirty();
        return this;
    }
    /**
     * 获取或设置树的层高
     */
    layerHeight(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.layerHeight;
        this._.layerHeight = height;
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    
    // --------------------插入函数--------------------
    newNode(id, value = null) {
        let elem = new Vertex(this.layer("vertex")).r(this._.r);
        if (value === null) elem.value(id);
        else elem.value(value);
        this.newNodeByTreeBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    /**
     * 创建一条从x指向y的连边，并且这条边的权值为value
     * 
     * - newLink(1, 2, 233) 连接1和2，并且边权为233
     */
    newLink(x, y, value = null) {
        let elem = new Line(this.layer("link"));
        if (value !== null) elem.value(value);
        this.newLinkByTreeBase(x, y, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty();
        return this;
    }

    update() {
        this.preUpdate();
        this._.isDirty = undefined;
        this._.dirtyByMe = 0;

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
            const vecI = [transX(descendants[i].x), transY(descendants[i].y)];
            for (let j = i + 1; j < descendants.length; j++) {
                const vecJ = [transX(descendants[j].x), transY(descendants[j].y)];
                rlimit = Math.min(rlimit, Vec.length(Vec.sub(vecI, vecJ)) / 2.1);
            }
        }
        rlimit = Math.min(rlimit, this._.r);
        info.descendants().forEach(node => {
            const x = transX(node.x);
            const y = transY(node.y);
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
        this.children.update();
        this.postUpdate();
        return this;
    }
}