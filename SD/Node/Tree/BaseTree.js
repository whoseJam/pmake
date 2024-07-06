import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/SDNode";
import { naiveGetterAndSetter } from "../Common";

export function BaseTree(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("links", []);
    this.member.new("nodes", []);
}

BaseTree.prototype = {
    ...SDNode.prototype
};

BaseTree.prototype.x = naiveGetterAndSetter("x", "setByEqual");
BaseTree.prototype.y = naiveGetterAndSetter("y", "setByEqual");

BaseTree.prototype.element = function(arg0, arg1) {
    if (arguments.length === 1)
        return this.findNodeById(arg0);
    if (arguments.length === 2)
        return this.findLinkById(arg0, arg1);
    console.error(arguments);
    throw new Error("Invalid Arguments");
}

BaseTree.prototype.value = function(arg0, arg1, arg2) {
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

BaseTree.prototype.opacity = function(arg0, arg1, arg2) {
    if (arguments.length === 0) {
        return SDNode.prototype.opacity.call(this);
    } else if (arguments.length === 1) {
        if (0 <= arg0 && arg0 <= 1) return SDNode.prototype.opacity.call(this, arg0);
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

BaseTree.prototype.color = function(arg0, arg1, arg2) {
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
BaseTree.prototype.stratify = function() {
    return stratify(this.member.get("nodes"));
}

BaseTree.prototype.findNodeById = function(nodeId) {
    const target = String(nodeId);
    const nodes = this.member.get("nodes");
    return nodes.find(node => String(node.nodeId) === target);
}

BaseTree.prototype.findLinkById = function(parentNodeId, childNodeId) {
    const targetParentId = String(parentNodeId);
    const targetChildId = String(childNodeId);
    const links = this.member.get("links");
    return links.find(link => String(link.parentNodeId) === targetParentId && String(link.childNodeId) === targetChildId);
}

BaseTree.prototype.father = function(id) {
    const node = this.findNodeById(id);
    if (!node) return undefined;
    return this.findNodeById(node.parentNodeId);
}

BaseTree.prototype.depth = function(u) {
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

BaseTree.prototype.lca = function(x, y) {
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

BaseTree.prototype.childrenOnTree = function(x) {
    const nodes = this.member.get("nodes");
    const target = String(x);
    const children = nodes.filter(node => String(node.parentNodeId) === target);
    return children; 
}

BaseTree.prototype.newNodeByBaseTree = function(id, elem) {
    elem.nodeId = id;
    const nodes = this.member.get("nodes");
    nodes.push(elem);
    this.children.push(elem);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.newLinkByBaseTree = function(x, y, elem) {
    elem.parentNodeId = x;
    elem.childNodeId = y;
    let node = this.findNodeById(y);
    node.parentNodeId = x;
    let links = this.member.get("links");
    links.push(elem);
    this.children.push(elem);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.eraseLinkByBaseTree = function(x, y) {
    const link = this.findLinkById(x, y);
    const links = this.member.get("links");
    const idx = links.indexOf(link);
    links.splice(idx, 1);
    this.children.erase(link);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.root = function(id, value = null) {
    if (id === undefined) {
        const nodes = this.member.get("nodes");
        return nodes.find(node => node.parentNodeId === undefined);
    }
    console.log("new node id=", id, "value=", value);
    this.newNode(id, value);
    return this;
}

BaseTree.prototype.link = function(x, y, value = null) {
    if (!this.findNodeById(y)) this.newNode(y);
    if (!this.findNodeById(x)) this.newNode(x);
    this.newLink(x, y, value);
    return this;
}

BaseTree.prototype.cut = function(x, y) {
    const link = this.findLinkById(x, y);
    const node = this.findNodeById(y);
    const links = this.member.get("links");
    const idx = links.indexOf(link);
    links.splice(idx, 1);
    this.children.erase(link);
    link.opacity(0).remove();
    node.parentNodeId = undefined;
    return this;
}

BaseTree.prototype.text = function() {
    const value = this.element.apply(this, arguments).value();
    if (!value || !value.text) return "";
    return value.text();
}

BaseTree.prototype.intValue = function() {
    const text = this.text.apply(this, arguments);
    return +text;
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