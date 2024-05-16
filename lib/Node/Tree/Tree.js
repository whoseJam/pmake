import { D3Layer } from "@/Node/D3Layer";
import { Line } from "@/Node/Basic/Line";
import { SDNode } from "@/Node/Node";
import { TreeBase } from "@/Node/Tree/TreeBase";
import { trim } from "@/Utility/Trim";
import { Vertex } from "@/Node/Element/Vertex";
import { Vec } from "@/Utility/Math";
import * as d3 from "d3";

/**
 * @class Tree
 */
export class Tree extends TreeBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("Tree");
        this.newLayer("link");
        this.newLayer("vertex");
        this._.nodeType = Vertex;
        this._.linkType = Line;
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
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        this._.width = width;
        this.dirty(this, "R");
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
        this.dirtyCheck("q");
        if (height === undefined) return this._.height;
        const depth = this.depth();
        this.layerHeight(height / depth);
        this.dirty(this, "R");
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
        this.dirtyCheck("q");
        if (r === undefined) return this._.r;
        this._.r = r;
        this.dirty(this, "R");
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
        this.dirtyCheck("q");
        if (height === undefined) return this._.layerHeight;
        this._.layerHeight = height;
        this.dirty(this, "R");
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
        const elem = new this._.nodeType(this.layer("vertex"));
        if (value === null) elem.value(id);
        else elem.value(value);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this)
            elem.opacity(1);
        };
        this.dirty(this, "R");
        this.newNodeByTreeBase(id, elem);
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
        const elem = new this._.linkType(this.layer("link"));
        if (value !== null) elem.value(value);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this)
            elem.opacity(1);
        };
        this.dirty(this, "R");
        this.newLinkByTreeBase(x, y, elem);
        return this;
    }

    update() {
        return d3TreeLayout.call(
            this,
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            [2.1], ["r"], ["r"]);
    }
}

/**
 * 基于d3的TreeLayout，对树类组件进行布局
 * @param {"vertical"|"horizontal"} mode
 * @param {(node: {x: number, y: number}) => number} transX 
 * @param {(node: {x: number, y: number}) => number} transY
 * @param {Array<number>} minDistanceRatio
 * @param {Array<string>} parentSizeIndex
 * @param {Array<string>} childSizeIndex
 * @returns {this}
 */
export function d3TreeLayout(mode, transX, transY, minDistanceRatio, parentSizeIndex, childSizeIndex) {
    this.preUpdate();
    let rt, tr;
    try {
        rt = d3.stratify()
        rt.id(d => d["nodeId"])
        rt.parentId(d => d["parentNodeId"])
        rt = rt(this._.nodes);
    } catch(error) { return this; }
    const hierarchy = d3.hierarchy(rt);
    if (mode === "vertical") {
        this._.height = hierarchy.height * this.layerHeight();
        tr = d3.tree().size([this._.width, this._.height]);
    } else {
        this._.width = hierarchy.height * this.layerWidth();
        tr = d3.tree().size([this._.height, this._.width]);
    }
    const info = tr(hierarchy);
    let limit = Infinity;
    const descendants = info.descendants(); 
    for (let i = 0; i < descendants.length; i++) {
        const vecI = [transX(descendants[i]), transY(descendants[i])];
        for (let j = i + 1; j < descendants.length; j++) {
            const vecJ = [transX(descendants[j]), transY(descendants[j])];
            limit = Math.min(limit, Vec.length(Vec.sub(vecI, vecJ)));
        }
    }

    const sizeCof = parentSizeIndex.map(index => this[index]());
    for (let i = 0; i < sizeCof.length; i++)
        sizeCof[i] = Math.min(sizeCof[i], limit / minDistanceRatio[i]);

    info.descendants().forEach(nodeInfo => {
        const x = transX(nodeInfo);
        const y = transY(nodeInfo);
        const node = nodeInfo.data.data;
        const move = () => {
            for (let i = 0; i < childSizeIndex.length; i++)
                if (childSizeIndex[i] in node) node[childSizeIndex[i]](sizeCof[i]);
            node.cx(x).cy(y);
        }
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