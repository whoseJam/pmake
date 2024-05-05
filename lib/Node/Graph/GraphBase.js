import { Node } from "../Node";
import { SDHelper } from "../../Utility/SDHelper";

/**
 * @class GraphBase
 * @description 提供了Graph类的基础方法
 */
export class GraphBase extends Node {
    constructor(node) {
        super(node);
        this._.x = 0;
        this._.y = 0;
        this._.width = 300;
        this._.height = 300;
        this._.links = [];
        this._.nodes = [];
        this.newLayer("vertex");
        this.newLayer("link");
    }

    /**
     * 获取一个Graph的内部元素，可以是节点，可以是边
     * @returns 
     */
    element() {
        if (arguments.length === 1) return element1.apply(this, arguments);
        if (arguments.length === 2) return element2.apply(this, arguments);
        console.log(arguments);
        throw new Error("GraphBase的element方法遇到错误的参数");
    }

    /**
     * 获取一个Graph内部元素的value，或者设置内部元素的value
     * @returns 
     */
    value() {
        if (arguments.length === 1) return value1.apply(this, arguments);
        if (arguments.length === 2) return value2.apply(this, arguments);
        if (arguments.length === 3) return value3.apply(this, arguments);
        console.log(arguments);
        throw new Error("GraphBase组件的value方法遇到错误的参数");
    }

    /**
     * 设置一个Graph的整体透明度，或者设置内部元素的透明度，或者获取内部元素的透明度
     * @returns 
     */
    opacity() {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (SDHelper.isOpacity(v)) {
                return super.opacity(v);
            } else if (SDHelper.isText(v))
                return this.findNodeById(v).opacity();
            console.log(arguments);
            throw new Error("GraphBase组件的opacity方法遇到错误的参数");
        }
        if (arguments.length === 2) return opacity2.apply(this, arguments);
        if (arguments.length === 3) return opacity3.apply(this, arguments);
        console.log(arguments);
        throw new Error("GraphBase组件的opacity方法遇到错误的参数");
    }

    /**
     * 设置一个Graph整体的颜色，或者设置内部元素的颜色，或者获取内部元素的颜色
     * @returns 
     */
    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        if (arguments.length === 3) return color3.apply(this, arguments);
        console.log(arguments);
        throw new Error("TreeBase组件的color方法遇到错误的参数"); 
    }

    /**
     * 通过nodeId，查询树中对应节点的编号，注意此处的编号相等判断用的是"=="
     * @param {string|number} nodeId 待查询的节点编号 
     * @returns {Node|null} 对应节点，如果未找到，返回null
     */
    findNodeById(nodeId) {
        const targetNodeId = String(nodeId);
        const nodes = this._.nodes;
        return nodes.find(node => String(node.nodeId) === targetNodeId);
    }

    /**
     * 查询一条从fromNodeId指向toNodeId的树边，注意此处的编号相等判断用的是"=="
     * @param {string|number} fromNodeId 待查询的边的父节点编号
     * @param {string|number} toNodeId 待查询的边的子节点编号
     * @returns {Node|null} 对应边，如果未找到，返回null
     */
    findLinkById(fromNodeId, toNodeId) {
        const targetFromNodeId = String(fromNodeId);
        const targetToNodeId = String(toNodeId);
        const links = this._.links;
        return links.find(link => String(link.fromNodeId) === targetFromNodeId && String(link.toNodeId) === targetToNodeId);
    }

    inNodes(x) {
        const targetToNodeId = String(x);
        const links = this._.links;
        const ins = links.filter(link => String(link.toNodeId) === targetToNodeId)
            .map(link => String(link.fromNodeId));
        return [...new Set(ins)].map(nodeId => this.findNodeById(nodeId));
    }

    inLinks(x) {
        const targetToNodeId = String(x);
        const links = this._.links;
        const ins = links.filter(link => String(link.toNodeId) === targetToNodeId);
        return ins;
    }

    outNodes(x) {
        const targetFromNodeId = String(x);
        const links = this._.links;
        const outs = links.filter(link => String(link.fromNodeId) === targetFromNodeId)
            .map(link => String(link.toNodeId))
        return [...new Set(outs)].map(nodeId => this.findNodeById(nodeId));
    }

    outLinks(x) {
        const targetFromNodeId = String(x);
        const links = this._.links;
        const outs = links.filter(link => String(link.fromNodeId) === targetFromNodeId);
        return outs;
    }

    /**
     * 新建一个编号为id，节点元素为elem的节点，所有继承GraphBase的子类需要自行构造elem
     * @param {string|number} id 
     * @param {Node} elem 
     * @returns 当前节点
     */
    newNodeByGraphBase(id, elem) {
        elem.nodeId = id;
        this._.nodes.push(elem);
        this.children.push(elem);
        return this;
    }
    
    /**
     * 新建一条从x指向y的边，所有继承GraphBase的子类需要自行构造elem
     * @param {string|number} x 父节点编号 
     * @param {string|number} y 子节点编号
     * @param {Node} elem 边的象征节点
     * @returns 当前节点
     */
    newLinkByGraphBase(x, y, elem) {
        elem.fromNodeId = x;
        elem.toNodeId = y;
        this._.links.push(elem);
        this.children.push(elem);
        return this;
    }

    /**
     * 新建一条从x到y的连边，其中x是起点，y是终点
     * @param {string|number} x 起点的节点编号
     * @param {string|number} y 终点的节点编号 
     * @param {Node|undefined} value 该连边的价值 
     * @returns 当前节点
     */
    link(x, y, value = null) {
        if (!this.findNodeById(y)) this.newNode(y);
        if (!this.findNodeById(x)) this.newNode(x);
        this.newLink(x, y, value);
        return this;
    }

    /**
     * 切断Graph中x到y的边
     * @param {string|number} x 起点的节点编号 
     * @param {string|number} y 终点的节点编号
     * @returns 当前节点
     */
    cut(x, y) {
        let link = this.findLinkById(x, y);
        let idx = this._.links.indexOf(link);
        this._.links.splice(idx, 1);
        this.children.erase(link);
        link.opacity(0).remove();
        return this;
    }
}

function element1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this.findNodeById(nodeId);
    console.log(arguments);
    throw new Error("GraphBase组件的element方法遇到错误的参数");
}
function element2(v1, v2) {
    return this.findLinkById(v1, v2);
}

function value1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this.findNodeById(nodeId).value();
    console.log(arguments);
    throw new Error("GraphBase组件的value方法遇到错误的参数");
}
function value2(v1, v2) {
    if (SDHelper.isSlide(v2)) {
        this.element(v1).value(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2)) {
        let link = this.findLinkById(v1, v2);
        if (link) return link.value();
        this.element(v1).value(Text(this, v2));
        return this;
    }
    console.log(arguments);
    throw new Error("GraphBase组件的value方法遇到错误的参数");
}
function value3(x, y, v) {
    v = SDHelper.any2Slide(v);
    let link = this.findLinkById(x, y);
    link.value(v);
    return this;
}

function opacity2(v1, v2) {
    if (SDHelper.isOpacity(v2)) {
        element1.call(this, v1).opacity(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2))
        return element2.call(this, v1, v2).opacity();
    console.log(arguments);
    throw new Error("GraphBase组件的opacity方法遇到错误的参数");
}
function opacity3(v1, v2, v3) {
    element2.call(this, v1, v2).opacity(v3);
    return this;
}

function color1(v1) {
    if (SDHelper.isColor(v1)) {
        for (let node of this._.nodes)
            node.color(v1);
        return this;
    } else if (SDHelper.isText(v1))
        return this.findNodeById(nodeId).color();
    console.log(arguments);
    throw new Error("GraphBase组件的color方法遇到错误的参数");
}
function color2(v1, v2) {
    if (SDHelper.isColor(v2)) {
        element1.call(this, v1).color(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2))
        return element2.call(this, v1, v2).color();
    console.log(arguments);
    throw new Error("GraphBase组件的color方法遇到错误的参数");
}
function color3(v1, v2, v3) {
    element2.call(this, v1, v2).color(v3);
    return this;
}