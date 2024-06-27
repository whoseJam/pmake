import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";

/**
 * @class TreeBase
 * @description 提供了Tree类的基础方法
 */
export class TreeBase extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this._.x = 0;
        this._.y = 0;
        this._.links = [];
        this._.nodes = [];
    }

    /**
     * 获取树的内部元素，可以是节点，可以是树边
     * @overload
     * @param {string|number} arg0
     * @returns {any} 对应树上的节点
     * @overload
     * @param {string|number} arg0
     * @param {string|number} arg1
     * @returns {any} 对应树上的边
     */
    element(arg0, arg1) {
        if (arguments.length === 1)
            return this.findNodeById(arg0);
        if (arguments.length === 2)
            return this.findLinkById(arg0, arg1);
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 获取树内部元素的value，或者设置内部元素的value
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
            this.element(arg0).value(arg1);
            return this;
        } else if (arguments.length === 3) {
            const link = this.findLinkById(arg0, arg1);
            link.value(arg2);
            return this;
        }
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 设置树的整体透明度，或者设置内部元素的透明度，或者获取内部元素的透明度
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
     * @param {number|string} parentNodeId
     * @param {number|string} childNodeId
     * @returns {number}
     */
    opacity(arg0, arg1, arg2) {
        if (arguments.length === 0) {
            return super.opacity();
        } else if (arguments.length === 1) {
            if (0 <= arg0 && arg0 <= 1) return super.opacity(arg0);
            return this.findNodeById(arg0).opacity();
        } else if (arguments.length === 2) {
            if (0 <= arg1 && arg1 <= 1) {
                this.findNodeById(arg0).opacity(arg1);
                return this;
            }
            return this.findLinkById(arg0, arg1).opacity();
        } else if (arguments.length === 3) {
            this.findLinkById(arg0, arg1).opacity(arg2);
            return this;
        }
        console.error(arguments);
        throw new Error("Invalid Arguments");
    }

    /**
     * 设置树整体的颜色，或者设置内部元素的颜色，或者获取内部元素的颜色
     * @overload
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     * @overload
     * @param {number|string} nodeId
     * @returns {string|{main: string, border: string}}
     * @overload
     * @param {number|string} nodeId
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     * @overload
     * @param {number|string} parentNodeId
     * @param {number|string} childNodeId
     * @returns {string|{main: string, border: string}}
     * @overload
     * @param {number|string} parentNodeId
     * @param {number|string} childNodeId
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     */
    color(arg0, arg1, arg2) {
        if (arguments.length === 1) {
            if (typeof(arg0) === "string" || "main" in arg0) {
                this._.nodes.forEach(node => node.color(arg0));
                return this;
            } else return this.findNodeById(arg0).color();
        } else if (arguments.length === 2) {
            if (typeof(arg1) === "string" || "main" in arg1) {
                this.findNodeById(arg0).color(arg1);
                return this;
            } else return this.findLinkById(arg0, arg1);
        } else if (arguments.length === 3) {
            this.findLinkById(arg0, arg1).color(arg2);
            return this;
        }
        console.error(arguments);
        throw new Error("Invalid Arguments");
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
     * @param {number|string} nodeId 待查询的节点编号 
     * @returns {SDNode}
     */
    findNodeById(nodeId) {
        const target = String(nodeId);
        const nodes = this._.nodes;
        return nodes.find(node => String(node.nodeId) === target);
    }

    /**
     * 查询一条从parentNodeId指向childNodeId的树边
     * @param {number|string} parentNodeId 待查询的边的父节点编号
     * @param {number|string} childNodeId 待查询的边的子节点编号
     * @returns {SDNode}
     */
    findLinkById(parentNodeId, childNodeId) {
        const targetParentId = String(parentNodeId);
        const targetChildId = String(childNodeId);
        const links = this._.links;
        return links.find(link => String(link.parentNodeId) === targetParentId && String(link.childNodeId) === targetChildId);
    }
    
    /**
     * 获取编号为id的节点的父节点
     * @param {number|string} id 待查询节点的节点编号
     * @returns {SDNode}
     */
    father(id) {
        const node = this.findNodeById(id);
        if (!node) return undefined;
        return this.findNodeById(node.parentNodeId);
    }

    /**
     * 查询深度信息
     * - depth() 获取树的深度
     * - depth(6) 获取6号节点对应的深度
     * @overload
     * @returns {number} 树的深度
     * @overload
     * @param {number|string} u
     * @returns {number}
     */
    depth(u) {
        if (u === undefined) {
            let root = this.stratify();
            if (!root) return 0;
            return root.height;
        } else {
            let ans = 1;
            while (this.father(u)) { u = this.father(u).nodeId; ans++; }
            return ans;
        }
    }

    /**
     * 获取两个节点的最近公共祖先
     * @param {number|string} x 
     * @param {number|string} y 
     * @returns {number|string} 
     */
    lca(x, y) {
        let depthx = this.depth(x);
        let depthy = this.depth(y);
        while (x != y) {
            if (depthx < depthy) {
                x = this.father(x);
                depthx--;
            } else {
                y = this.father(y);
                depthy--;
            }
        }
        return x;
    }

    /**
     * 获取树上某个点的子节点
     * @param {number|string} x 
     * @returns {Array<SDNode>}
     */
    childrenOnTree(x) {
        const nodes = this._.nodes;
        const target = String(x);
        const children = nodes.filter(node => String(node.parentNodeId) === target);
        return children; 
    }

    /**
     * 新建一个编号为id，节点元素为elem的节点
     * @param {number|string} id 
     * @param {SDNode} elem 
     * @returns {this}
     */
    newNodeByTreeBase(id, elem) {
        // @ts-ignore
        elem.nodeId = id;
        let nodes = this._.nodes;
        nodes.push(elem);
        this.children.push(elem);
        return this;
    }
    
    /**
     * 新建一条从x指向y的树边
     * @param {number|string} x 父节点编号 
     * @param {number|string} y 子节点编号
     * @param {SDNode} elem 边的象征节点
     * @returns {this}
     */
    newLinkByTreeBase(x, y, elem) {
        // @ts-ignore
        elem.parentNodeId = x;
        // @ts-ignore
        elem.childNodeId = y;
        let node = this.findNodeById(y);
        node.parentNodeId = x;
        let links = this._.links;
        links.push(elem);
        this.children.push(elem);
        return this;
    }

    /**
     * 删除从x指向y的树边
     * @param {number|string} x 
     * @param {number|string} y 
     * @returns {this}
     */
    eraseLinkByTreeBase(x, y) {
        let link = this.findLinkById(x, y);
        let idx = this._.links.indexOf(link);
        this._.links.splice(idx, 1);
        this.children.erase(link);
        return this;
    }

    /**
     * 操作树的树根
     * @overload
     * @param {number|string} id
     * @returns {this}
     * @overload
     * @param {number|string} id
     * @param {SDNode} value
     * @returns {this}
     * @overload
     * @returns {any} 树根
     */
    root(id, value = null) {
        if (id === undefined) {
            const nodes = this._.nodes;
            return nodes.find(node => node.parentNodeId === undefined);
        }
        // @ts-ignore
        this.newNode(id, value);
        return this;
    }

    /**
     * 新建一条从x到y的连边，其中x是父节点，y是子节点
     * @overload
     * @param {number|string} x 父节点的节点编号
     * @param {number|string} y 子节点的节点编号 
     * @param {SDNode} value 该连边的价值 
     * @returns {this}
     * @overload
     * @param {number|string} x
     * @param {number|string} y
     * @returns {this}
     */
    link(x, y, value = null) {
        if (!this.findNodeById(y)) this.newNode(y);
        if (!this.findNodeById(x)) this.newNode(x);
        this.newLink(x, y, value);
        return this;
    }

    /**
     * 切断树中x到y的边
     * @param {number|string} x 父节点编号 
     * @param {number|string} y 子节点编号
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

    /**
     * 获取树上某个元素持有的文本，如果不存在对应的元素，或者元素上不存在文本，则返回空字符串
     * - text(3) 获取3号节点上的文本
     * - text(1,5) 获取1->5这条边上的文本
     * @returns {string}
     */
    text() {
        const value = this.element.apply(this, arguments).value();
        if (!value || !value.text) return "";
        return value.text();
    }

    /**
     * 获取树上某个元素持有的值，如果不存在对应的元素，或者元素上不存在值，则返回0
     * - intValue(3) 获取3号节点上的值
     * - intValue(1,5) 获取1->5这条边上的值
     * @returns {number}
     */
    intValue() {
        const text = this.text.apply(this, arguments);
        return +text;
    }
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