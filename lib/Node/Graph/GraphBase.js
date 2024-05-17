import { D3Layer } from "../D3Layer";
import { SDNode } from "../Node";

/**
 * @class GraphBase
 * @description 提供了Graph类的基础方法
 */
export class GraphBase extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
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
     * 获取图的内部元素，可以是节点，可以是边
     * @overload
     * @param {string|number} arg0
     * @returns {any}
     * @overload
     * @param {string|number} arg0
     * @param {string|number} arg1
     * @returns {any}
     */
    element(arg0, arg1) {
        if (arguments.length === 1)
            return this.findNodeById(arg0);
        else if (arguments.length === 2)
            return this.findLinkById(arg0, arg1);
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 获取图内部元素的value，或者设置内部元素的value
     * @overload
     * @param {string|number} arg0
     * @returns {any}
     * @overload
     * @param {string|number} arg0
     * @param {string|number|SDNode} arg1
     * @returns {any}
     * @overload
     * @param {string|number} arg0
     * @param {string|number} arg1
     * @param {string|number|SDNode} arg2
     * @returns {this} 
     */
    value(arg0, arg1, arg2) {
        if (arguments.length === 1) 
            return this.findNodeById(arg0).value();
        else if (arguments.length === 2) {
            const link = this.findLinkById(arg0, arg1);
            if (link) return link.value();
            this.findNodeById(arg0).value(arg1);
            return this;
        } else if (arguments.length === 3) {
            this.findLinkById(arg0, arg1).value(arg2);
        }
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 设置图的整体透明度，或者设置内部元素的透明度，或者获取内部元素的透明度
     * @overload
     * @param {number} opacity - 透明度
     * @returns {this}
     * @overload
     * @param {number|string} nodeId
     * @returns {number}
     * @overload
     * @param {number|string} nodeId
     * @param {number} opacity
     * @returns {this}
     * @overload
     * @param {number|string} fromNodeId
     * @param {number|string} toNodeId
     * @returns {number}
     */
    opacity(arg0, arg1, arg2) {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (0 <= v && v <= 1) super.opacity(v);
            else return this.findNodeById(v).opacity();
        } else if (arguments.length === 2) {
            if (0 <= arg1 && arg1 <= 1) {
                this.findNodeById(arg0).opacity(arg1);
                return this;
            } else return this.findLinkById(arg0, arg1).opacity();
        } else if (arguments.length === 3) {
            this.findLinkById(arg0, arg1).opacity(arg2);
            return this;
        }
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 设置图整体的颜色，或者设置内部元素的颜色，或者获取内部元素的颜色
     * @overload
     * @param {import("../../Utility/Color").SDColor} color
     * @returns {this}
     * @overload
     * @param {number|string} nodeId
     * @returns {import("../../Utility/Color").SDColor}
     * @overload
     * @param {number|string} nodeId
     * @param {import("../../Utility/Color").SDColor} color
     * @returns {this}
     * @overload
     * @param {number|string} fromNodeId
     * @param {number|string} toNodeId
     * @returns {import("../../Utility/Color").SDColor}
     * @overload
     * @param {number|string} fromNodeId
     * @param {number|string} toNodeId
     * @param {import("../../Utility/Color").SDColor} color
     * @returns {this}
     */
    color(arg0, arg1, arg2) {
        if (arguments.length === 1) {
            if (typeof(arg0) === "string" || "main" in arg0) {
                this._.nodes.forEach(node => node.color(arg1));
                return this;
            }
            return this.findNodeById(arg0).color();
        } else if (arguments.length === 2) {
            if (typeof(arg1) === "string" || "main" in arg1) {
                this.findNodeById(arg0).color(arg1);
                return this;
            } else return this.findLinkById(arg0, arg1).color();
        } else if (arguments.length === 3) {
            this.findLinkById(arg0, arg1).color(arg2);
            return this;
        }
        console.error(arguments);
        throw new Error("Invalid Arguments"); 
    }

    /**
     * 通过nodeId，查询树中对应节点的编号，注意此处的编号相等判断用的是"=="
     * @param {string|number} nodeId 待查询的节点编号 
     * @returns {any|undefined}
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
     * @returns {any|undefined}
     */
    findLinkById(fromNodeId, toNodeId) {
        const targetFromNodeId = String(fromNodeId);
        const targetToNodeId = String(toNodeId);
        const links = this._.links;
        return links.find(link => String(link.fromNodeId) === targetFromNodeId && String(link.toNodeId) === targetToNodeId);
    }

    /**
     * 获取某节点的所有入节点
     * @overload
     * @param {number|string} x
     * @param {"direct"|"undirect"} mode
     * @returns {Array<SDNode>}
     * @overload
     * @param {number|string} x
     * @returns {Array<SDNode>}
     */
    inNodes(x, mode = "direct") {
        const targetToNodeId = String(x);
        const links = this.inLinks(x, mode);
        const mapper = (mode === "direct") ?
            link => String(link.fromNodeId) :
            link => String(link.toNodeId) === targetToNodeId ? String(link.fromNodeId) : String(link.toNodeId);
        const ins = links.map(mapper);
        return [...new Set(ins)].map(nodeId => this.findNodeById(nodeId));
    }

    /**
     * 获取某节点的所有入边
     * @overload
     * @param {number|string} x
     * @param {"direct"|"undirect"} mode 
     * @returns {Array<SDNode>}
     * @overload
     * @param {number|string} x
     * @returns {Array<SDNode>}
     */
    inLinks(x, mode = "direct") {
        const targetToNodeId = String(x);
        const links = this._.links;
        const filter = (mode === "direct") ? 
            link => String(link.toNodeId) === targetToNodeId :
            link => String(link.toNodeId) === targetToNodeId || String(link.fromNodeId) === targetToNodeId;
        const ins = links.filter(filter);
        return ins;
    }

    /**
     * 获取某节点的所有出节点
     * @overload
     * @param {number|string} x
     * @param {"direct"|"undirect"} mode  
     * @returns {Array<SDNode>}
     * @overload
     * @param {number|string} x
     * @returns {Array<SDNode>}
     */
    outNodes(x, mode = "direct") {
        const targetFromNodeId = String(x);
        const links = this.outLinks(x, mode);
        const mapper = (mode === "direct") ?
            link => String(link.toNodeId) :
            link => String(link.fromNodeId) === targetFromNodeId ? String(link.toNodeId) : String(link.fromNodeId);
        const outs = links.map(mapper)
        return [...new Set(outs)].map(nodeId => this.findNodeById(nodeId));
    }

    /**
     * 获取某节点的所有出边
     * @overload
     * @param {number|string} x
     * @param {"direct"|"undirect"} mode 
     * @returns {Array<SDNode>}
     * @overload
     * @param {number|string} x
     * @returns {Array<SDNode>}
     */
    outLinks(x, mode = "direct") {
        const targetFromNodeId = String(x);
        const links = this._.links;
        const filter = (mode === "direct") ? 
            link => String(link.fromNodeId) === targetFromNodeId :
            link => String(link.fromNodeId) === targetFromNodeId || String(link.toNodeId) === targetFromNodeId;
        const outs = links.filter(filter);
        return outs;
    }

    /**
     * 新建一个编号为id，节点元素为elem的节点，所有继承GraphBase的子类需要自行构造elem
     * @param {string|number} id 
     * @param {SDNode} elem 
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
        // @ts-ignore
        elem.fromNodeId = x;
        // @ts-ignore
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
        // @ts-ignore
        if (!this.findNodeById(y)) this.newNode(y);
        // @ts-ignore
        if (!this.findNodeById(x)) this.newNode(x);
        // @ts-ignore
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

    nodes() {
        return this._.nodes;
    }

    links() {
        return this._.links;
    }

    nodesId() {
        const nodesId = this._.nodes.map(node => node.nodeId);
        return [... new Set(nodesId)];
    }

    toNodeId(fromNodeId, link) {
        const targetFromNodeId = String(fromNodeId);
        if (String(link.fromNodeId) === targetFromNodeId) return link.toNodeId;
        return link.fromNodeId;
    }
}
