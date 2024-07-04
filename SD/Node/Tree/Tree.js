import { Line } from "@/Node/Basic/Line";
import { trim } from "@/Utility/Trim";
import { Vertex } from "@/Node/Element/Vertex";
import { Vec } from "@/Utility/Math";
import { BaseTree } from "./BaseTree";
import { naiveGetterAndSetter } from "../Common";
import * as d3 from "d3";

export function Tree(parent) {
    BaseTree.call(this, parent);

    this.g().type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = Line;

    this.member.new("r", 20);
    this.member.new("width", 300);
    this.member.new("height", 0);
    this.member.new("layerHeight", 60);
}

Tree.prototype = {
    ...BaseTree.prototype
};

Tree.prototype.width       = naiveGetterAndSetter("width", "setByEqual");
Tree.prototype.r           = naiveGetterAndSetter("r", "setByEqual");
Tree.prototype.layerHeight = naiveGetterAndSetter("layerHeight", "setByEqual");
Tree.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const depth = this.depth();
    this.layerHeight(height / depth);
    return this;
}

Tree.prototype.updateList = [
    ...Tree.prototype.updateList,
    update
];

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
Tree.prototype.newNode = function(id, value = null) {
    const elem = new this._.nodeType(this.layer("nodes"));
    if (value === null) elem.value(id);
    else elem.value(value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this)
        elem.opacity(1);
    };
    this.newNodeByBaseTree(id, elem);
    this.tryUpdate();
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
Tree.prototype.newLink = function(x, y, value = null) {
    const elem = new this._.linkType(this.layer("links"));
    if (value !== null) elem.value(value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this)
        elem.opacity(1);
    };
    this.newLinkByBaseTree(x, y, elem);
    this.tryUpdate();
    return this;
}

function update() {
    d3TreeLayout.call(
        this,
        "vertical",
        node => node.x + this.x(),
        node => node.y + this.y(),
        [2.1], ["r"], ["r"]);
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
    let rt, tr;
    try {
        rt = d3.stratify()
        rt.id(d => d["nodeId"])
        rt.parentId(d => d["parentNodeId"])
        rt = rt(this.member.get("nodes"));
    } catch(error) { console.log(error); return this; }
    const hierarchy = d3.hierarchy(rt);
    if (mode === "vertical") {
        this.member.set("height", hierarchy.height * this.layerHeight());
        tr = d3.tree().size([this.member.get("width"), this.member.get("height")]);
    } else {
        this.member.set("width", hierarchy.height * this.layerWidth());
        tr = d3.tree().size([this.member.get("height"), this.member.get("width")]);
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
        this.tryMove(node, () => {
            for (let i = 0; i < childSizeIndex.length; i++)
                if (childSizeIndex[i] in node) node[childSizeIndex[i]](sizeCof[i]);
            node.cx(x).cy(y);
        });
    });
    info.links().forEach(linkInfo => {
        const source = linkInfo.source;
        const target = linkInfo.target;
        const src = source.data.id;
        const tgt = target.data.id;
        const link = this.findLinkById(src, tgt);
        if (!link) return;
        this.tryMove(link, () => {
            link.source(transX(source), transY(source));
            link.target(transX(target), transY(target));
            trim(link, this.findNodeById(src), this.findNodeById(tgt));
        });
    });
}