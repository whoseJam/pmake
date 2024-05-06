// @ts-check
import { TreeBase } from "./TreeBase";
import { trim } from "../../Utility/Trim";
import { Vertex } from "../Element/Vertex";
import { Line } from "../Basic/Line";
import { Const } from "../../Utility/Const";
import { Vec } from "../../Utility/Math";
import * as d3 from "d3";
import { SDNode } from "../Node";

export class Tree extends TreeBase {
    /**
     * @constructor
     * @param {SDNode|import("../Node").D3Node} node 
     */
    constructor(node) {
        super(node);
        this.g().attr("type", "Tree");
        this.newLayer("vertex");
        this.newLayer("link");
        this._.r = 20;
        this._.width = 300;
        this._.height = 0;
        this._.layerHeight = 60;
    }

    /**
     * 操作树的width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        this._.width = width;
        this.dirty();
        return this;
    }

    /**
     * 操作树的height属性
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        const depth = this.depth();
        this.layerHeight(height / depth);
        this.dirty(Const.DirtyChannel.height);
        return this;
    }

    /**
     * 操作树上节点的半径
     * @overload
     * @param {number} r 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    r(r) {
        this.dirtyCheck();
        if (r === undefined) return this._.r;
        this._.r = r;
        this.dirty();
        return this;
    }

    /**
     * 操作树的层高
     * - layerHeight() 获取树的层高
     * - layerHeight(80) 设置层高为80
     * @overload
     * @param {number} height
     * @returns {this}
     * @overload
     * @returns {number}
     */
    layerHeight(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.layerHeight;
        this._.layerHeight = height;
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    
    /**
     * 新建一个编号为id，值元素为value的节点
     * - newNode(1) 创建一个编号为1，值元素也为1的节点
     * - newNode(1, "H1") 创建一个编号为1，值元素为"H1"的节点
     * - newNode(1, new Mathjax(...)) 创建一个编号为1，值元素为Mathjax类型的节点
     * @overload
     * @param {number|string} id 
     * @returns {this}
     * @overload
     * @param {number|string} id
     * @param {SDNode} value 
     * @returns {this}
     */
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
     * 创建一条从x指向y的连边
     * @overload
     * @param {number|string} x
     * @param {number|string} y
     * @returns {this}
     * @overload
     * @param {number|string} x
     * @param {number|string} y
     * @param {SDNode} value
     * @returns {this}
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
        let rt;
        try {
            rt = d3.stratify()
            rt.id(d => d["nodeId"])
            rt.parentId(d => d["parentNodeId"])
            rt = rt(this._.nodes);
        } catch(error) { return this; }
        const hierarchy = d3.hierarchy(rt);
        this._.height = hierarchy.height * this.layerHeight();
        const tr = d3.tree().size([this._.width, this._.height]);
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
                rlimit = Math.min(rlimit, Vec.length(Vec.sub(vecI, vecJ)) / 2.1);
            }
        }
        rlimit = Math.min(rlimit, this._.r);
        info.descendants().forEach(nodeInfo => {
            const x = transX(nodeInfo.x);
            const y = transY(nodeInfo.y);
            const node = nodeInfo.data.data;
            const move = () => { node.r(rlimit).cx(x).cy(y); }
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