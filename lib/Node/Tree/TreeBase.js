import { SDHelper } from "../../Utility/SDHelper";
import { Node } from "../Node";

/**
 * @class TreeBase
 * @description 提供了Tree类的基础方法
 */
export class TreeBase extends Node {
    constructor(node) {
        super(node);

        this._.x = 0;
        this._.y = 0;
        this._.links = [];
        this._.nodes = [];
    }

    /**
     * 获取一个Tree的内部元素，可以是节点，可以是树边
     * @returns
     */
    element() {
        if (arguments.length === 1) return element1.apply(this, arguments);
        if (arguments.length === 2) return element2.apply(this, arguments);
        console.error(arguments);
    }

    /**
     * 获取一个Tree内部元素的value，或者设置内部元素的value
     * @returns 
     */
    value() {
        if (arguments.length === 1) return value1.apply(this, arguments);
        if (arguments.length === 2) return value2.apply(this, arguments);
        if (arguments.length === 3) return value3.apply(this, arguments);
        console.error(arguments);
    }

    /**
     * 设置一个Tree的整体透明度，或者设置内部元素的透明度，或者获取内部元素的透明度
     * @returns 
     */
    opacity() {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (SDHelper.isOpacity(v))   return super.opacity(v);
            else if (SDHelper.isText(v)) return this.findNodeById(v).opacity();
            console.error(arguments);
        }
        if (arguments.length === 2) return opacity2.apply(this, arguments);
        if (arguments.length === 3) return opacity3.apply(this, arguments);
        console.error(arguments);
    }

    /**
     * 设置一个Tree整体的颜色，或者设置内部元素的颜色，或者获取内部元素的颜色
     * @returns 
     */
    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        if (arguments.length === 3) return color3.apply(this, arguments);
        console.error(arguments);
    }

    /**
     * 将Tree按层次划分
     * @returns 
     */
    stratify() {
        return stratify(this._.nodes);
    }

    /**
     * 通过nodeId，查询树中对应节点的编号，注意此处的编号相等判断用的是"=="
     * @param {string|number} nodeId 待查询的节点编号 
     * @returns {Node|undefined}
     */
    findNodeById(nodeId) {
        const target = String(nodeId);
        const nodes = this._.nodes;
        return nodes.find(node => String(node.nodeId) === target);
    }

    /**
     * 查询一条从parentNodeId指向childNodeId的树边
     * @param {string|number} parentNodeId 待查询的边的父节点编号
     * @param {string|number} childNodeId 待查询的边的子节点编号
     * @returns {Node|undefined}
     */
    findLinkById(parentNodeId, childNodeId) {
        const targetParentId = String(parentNodeId);
        const targetChildId = String(childNodeId);
        const links = this._.links;
        return links.find(link => String(link.parentNodeId) === targetParentId && String(link.childNodeId) === targetChildId);
    }
    
    /**
     * 获取编号为id的节点的父节点编号
     * @param {string|number} id 待查询节点的节点编号
     * @returns {string} 父节点编号，根的父节点编号为""（空字符串）
     */
    father(id) {
        const node = this.findNodeById(id);
        if (!node) return undefined;
        return node.parentNodeId;
    }

    /**
     * 查询树的深度
     * @returns {number} 树的深度
     */
    depth(u) {
        if (u === undefined) {
            let root = this.stratify();
            if (!root) return 0;
            return root.height;
        } else {
            let ans = 1;
            while (this.father(u) !== "" && this.father(u)) { u = this.father(u); ans++; }
            return ans;
        }
    }

    /**
     * 获取两个节点的lca
     * @param {string|number} x 
     * @param {string|number} y 
     * @returns {string|number} lca
     */
    lca(x, y) {
        while (x != y) {
            if (this.depth(x) < this.depth(y)) { let tmp = x; x = y; y = tmp; }
            x = this.father(x);
        }
        return x;
    }

    childrenOnTree(x) {
        const nodes = this._.nodes;
        const target = String(x);
        const children = nodes.filter(node => String(node.parentNodeId) === target);
        return children; 
    }

    /**
     * 新建一个编号为id，节点元素为elem的节点，所有继承TreeBase的子类需要自行构造elem
     * @param {string|number} id 
     * @param {Node} elem 
     * @returns 当前节点
     */
    newNodeByTreeBase(id, elem) {
        elem.nodeId = id;
        let nodes = this._.nodes;
        nodes.push(elem);
        this.children.push(elem);
        return this;
    }
    
    /**
     * 新建一条从x指向y的树边，所有继承TreeBase的子类需要自行构造elem
     * @param {string|number} x 父节点编号 
     * @param {string|number} y 子节点编号
     * @param {Node} elem 边的象征节点
     * @returns 当前节点
     */
    newLinkByTreeBase(x, y, elem) {
        elem.parentNodeId = x;
        elem.childNodeId = y;
        let node = this.findNodeById(y);
        node.parentNodeId = x;
        let links = this._.links;
        links.push(elem);
        this.children.push(elem);
        return this;
    }

    eraseLinkByTreeBase(x, y) {
        let link = this.findLinkById(x, y);
        let idx = this._.links.indexOf(link);
        this._.links.splice(idx, 1);
        this.children.erase(link);
        return this;
    }

    /**
     * 查询树的根的id，或者新建一个编号为id，价值为value的树根
     * @param {string|number|undefined} id 如果传入，则指定新建的树根的编号；否则代表查询树根编号
     * @param {Node|undefined} value 如果传入，则指定了新建树根的value 
     * @returns {Node|string} 当前节点，或者树根编号
     */
    root(id, value = null) {
        if (id === undefined) {
            const nodes = this._.nodes;
            return nodes.find(node => node.parentNodeId === undefined);
        }
        this.newNode(id, value);
        return this;
    }

    /**
     * 新建一条从x到y的连边，其中x是父节点，y是子节点
     * @param {string|number} x 父节点的节点编号
     * @param {string|number} y 子节点的节点编号 
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
     * 切断树中x到y的边
     * @param {string|number} x 父节点编号 
     * @param {string|number} y 子节点编号
     * @returns 当前节点
     */
    cut(x, y) {
        let link = this.findLinkById(x, y);
        let node = this.findNodeById(y);
        let idx = this._.links.indexOf(link);
        this._.links.splice(idx, 1);
        this.children.erase(link);
        link.opacity(0).remove();
        node.parentNodeId = undefined;
        return this;
    }

    text() {
        return this.element.apply(this, arguments).value().text();
    }
}

function element1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this.findNodeById(nodeId);
    console.error(arguments);
}
function element2(v1, v2) {
    return this.findLinkById(v1, v2);
}

function value1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this.findNodeById(nodeId).value();
    console.error(arguments);
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
    console.error(arguments);
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
    console.error(arguments);
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
        return this.findNodeById(v1).color();
    console.error(arguments);
}
function color2(v1, v2) {
    if (SDHelper.isColor(v2)) {
        element1.call(this, v1).color(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2))
        return element2.call(this, v1, v2).color();
    console.error(arguments);
}
function color3(v1, v2, v3) {
    element2.call(this, v1, v2).color(v3);
    return this;
}

function stratify(nodes) {
    let root = undefined;
    const pool = {};
    for (let node of nodes) {
        const id = String(node.nodeId);
        pool[id] = {
            children: [],
            data: node,
            depth: 0,
            height: 0,
            id: String(id),
            parent: null,
        }
    }
    for (let node of nodes) {
        const id = String(node.nodeId);
        if (node.parentNodeId === undefined) {
            if (!root) root = id;
        } else {
            const parent = pool[node.parentNodeId];
            if (!parent) {
                console.log(node, node.parentNodeId);
                console.log(nodes);
                console.log(pool);
            }
            const child = pool[id];
            parent.children.push(child);
        }
    }
    function dfs(u) {
        u.height = u.depth;
        for (let i = 0; i < u.children.length; i++) {
            let v = u.children[i];
            v.depth = u.depth + 1;
            dfs(v);
            u.height = Math.max(u.height, v.height);
        }
    }
    if (!root) return undefined;
    dfs(pool[root]);
    return pool[root];
}