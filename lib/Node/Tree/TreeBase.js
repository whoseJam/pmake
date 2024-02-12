import { SDHelper } from "../../Utility/SDHelper";
import { Node } from "../Node";

export class TreeBase extends Node {
    constructor(node) {
        super(node);

        this._.x = 0;
        this._.y = 0;
        this._.links = [];
        this._.nodes = [];
    }

    element() {
        if (arguments.length === 1) return element1.apply(this, arguments);
        if (arguments.length === 2) return element2.apply(this, arguments);
        throw new Error("TreeLike组件的element方法遇到错误的参数" + arguments);
    }

    value() {
        if (arguments.length === 1) return value1.apply(this, arguments);
        if (arguments.length === 2) return value2.apply(this, arguments);
        if (arguments.length === 3) return value3.apply(this, arguments);
        throw new Error("TreeLike组件的value方法遇到错误的参数" + arguments);
    }

    opacity() {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (SDHelper.isOpacity(v)) {
                super.opacity(v);
            } else if (SDHelper.isText(v))
                return this._.nodes[v].node.opacity();
                throw new Error("TreeLike组件的opacity方法遇到错误的参数" + arguments);
        }
        if (arguments.length === 2) return opacity2.apply(this, arguments);
        if (arguments.length === 3) return opacity3.apply(this, arguments);
        throw new Error("TreeLike组件的opacity方法遇到错误的参数" + arguments);
    }

    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        if (arguments.length === 3) return color3.apply(this, arguments);
        throw new Error("invalid arguments"); 
    }

    stratify() {
        return stratify.call(this);
    }

    findNodeById(nodeId) {
        for (let node of this._.nodes)
            if (node.nodeId == nodeId)
                return node;
        return null;
    }

    findLinkById(parentNodeId, childNodeId) {
        for (let link of this._.links)
            if (link.parentNodeId == parentNodeId && link.childNodeId == childNodeId)
                return link;
        return null;
    }
    
    father(id) {
        let node = this.findNodeById(id);
        return node.parentNodeId;
    }

    depth() {
        let root = tthis.stratify();
        if (!root) return 0;
        return root.height;
    }

    newNode(id, elem) {
        elem.nodeId = id;
        this._.nodes.push(elem);
        this.update();
        return this;
    }
    
    newLink(x, y, elem) {
        elem.parentNodeId = x;
        elem.childNodeId = y;
        this.findNodeById(y).parentNodeId = x;
        this._.links.push(elem);
        this.update();
        return this;
    }

    /**
     * 查询树的根的id，或者新建一个编号为id，价值为value的树根
     * @param {string|number|undefined} id 如果传入，则指定新建的树根的编号；否则代表查询树根编号
     * @param {Node|undefined} value 如果传入，则指定了新建树根的value 
     * @returns 
     */
    root(id, value) {
        if (id === undefined) {
            for (let node of this._.nodes)
                if (node.parentNodeId === "") return node.nodeId;
            return null;
        }
        this.newNode(id, value);
        this.update();
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
        let newRoot = (this.root() === y);
        if (!this.findNodeById(y)) this.newNode(y);
        if (!this.findNodeById(x)) this.newNode(x);
        let nodeX = this.findNodeById(x), nodeY = this.findNodeById(y);
        if (newRoot) nodeX.parentNodeId = ""
        this.newLink(x, y, value);
        return this;
    }

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
    throw new Error("TreeLike组件的element方法遇到错误的参数" + arguments);
}
function element2(v1, v2) {
    return this.findLinkById(v1, v2);
}

function value1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this.findNodeById(nodeId).value();
    throw new Error("TreeLike组件的element方法遇到错误的参数" + arguments);
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
    throw new Error("TreeLike组件的element方法遇到错误的参数" + arguments);
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
    throw new Error("invalid arguments");
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
    throw new Error("invalid arguments");
}
function color2(v1, v2) {
    if (SDHelper.isColor(v2)) {
        element1.call(this, v1).color(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2))
        return element2.call(this, v1, v2).color();
    throw new Error("invalid arguments");
}
function color3(v1, v2, v3) {
    element2.call(this, v1, v2).color(v3);
    return this;
}

function stratify() {
    let root;
    let nodes = this._.nodes;
    let pool = {};
    for (let node of nodes)
        pool[node.nodeId] = {
            children: [],
            data: nodes[id],
            depth: 0,
            height: 0,
            id: String(id),
            parent: null,
        }
    for (let node of nodes) {
        if (node.parentNodeId === "") root = id;
        else {
            let parent = pool[node.parentNodeId];
            let child = pool[id];
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
    if (!root) return null;
    dfs(pool[root]);
    return pool[root];
}