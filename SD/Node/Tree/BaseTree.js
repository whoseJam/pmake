import { SDNode } from "@/Node/SDNode";

import { IsNumberOrString } from "@/Utility/Check";

export function BaseTree(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("links", []);
    this.member.new("nodes", []);

    this._.BASE_TREE = true;

    return this;
}

BaseTree.prototype = {
    ...SDNode.prototype
};

BaseTree.prototype.x = SDNode.OrdinaryGSet("x", "setByEqual");
BaseTree.prototype.y = SDNode.OrdinaryGSet("y", "setByEqual");

BaseTree.prototype.element = function(arg0, arg1) {
    if (arguments.length === 1)
        return this.findNodeById(arg0);
    if (arguments.length === 2)
        return this.findLinkById(arg0, arg1);
    console.log(arguments);
    throw new Error("Invalid Arguments");
}

BaseTree.prototype.value = function(arg0, arg1, arg2) {
    if (arguments.length === 1) {
        const node = this.findNodeById(arg0);
        if (!node) {
            throw new Error(`Node (id = ${arg0}) Do Not Exists`);
        }
        return node.value();
    }
    else if (arguments.length === 2) {
        if (IsNumberOrString(arg0) && IsNumberOrString(arg1)) {
            const link = this.findLinkById(arg0, arg1);
            if (link) {
                return link.value();
            }
        }
        const node = this.findNodeById(arg0);
        if (!node) {
            throw new Error(`Node (id = ${arg0}) Do Not Exists`);
        }
        node.value(arg1);
        return this;
    } else if (arguments.length === 3) {
        const link = this.findLinkById(arg0, arg1);
        if (!link) {
            throw new Error(`Link (parentId = ${arg0} childId = ${arg1}) Do Not Exists`);
        }
        link.value(arg2);
        return this;
    }
    console.log(arguments);
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
    const nodes = this.member.get("nodes");
    if (arguments.length === 1) {
        if (typeof(arg0) === "string" || "main" in arg0) {
            nodes.forEach(node => node.color(arg0));
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
        const root = this.stratify();
        return root ? root.height : 0;
    } 
    let depth = 0;
    while (this.father(u)) {
        u = this.father(u).nodeId;
        depth++;
    }
    return depth;
}

BaseTree.prototype.lca = function(x, y) {
    let dx = this.depth(x);
    let dy = this.depth(y);
    let iterCount = 0;
    while (x !== y && (++iterCount) <= 100) {
        if (dx > dy) {
            x = this.father(x).nodeId;
            dx--;
        } else {
            y = this.father(y).nodeId;
            dy--;
        }
    }
    if (iterCount > 100) {
        throw new Error(`Unlimit Iteration At lca(${x}, ${y}): Maybe Caused By A Broken Tree`);
    }
    return this.findNodeById(x);
}

BaseTree.prototype.childrenOnTree = function(x) {
    const nodes = this.member.get("nodes");
    const target = String(x);
    const children = nodes.filter(node => String(node.parentNodeId) === target);
    return children; 
}

BaseTree.prototype.newNodeByBaseTree = function(id, node) {
    node.nodeId = id;
    const nodes = this.member.get("nodes");
    nodes.push(node);
    this.children.push(node);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.newLinkByBaseTree = function(x, y, link) {
    link.parentNodeId = x;
    link.childNodeId = y;
    const node = this.findNodeById(y);
    node.parentNodeId = x;
    const links = this.member.get("links");
    links.push(link);
    this.children.push(link);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.eraseLinkByBaseTree = function(x, y) {
    const link = this.findLinkById(x, y);
    const links = this.member.get("links");
    const index = links.indexOf(link);
    links.splice(index, 1);
    this.children.erase(link);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.root = function(id, value) {
    if (id === undefined) {
        const nodes = this.member.get("nodes");
        return nodes.find(node => node.parentNodeId === undefined);
    }
    this.newNode(id, value);
    return this;
}

BaseTree.prototype.link = function(x, y, value) {
    if (!this.findNodeById(y)) this.newNode(y);
    if (!this.findNodeById(x)) this.newNode(x);
    this.newLink(x, y, value);
    return this;
}

BaseTree.prototype.cut = function(x, y) {
    const link = this.findLinkById(x, y);
    link.opacity(0).remove();
    this.eraseLinkByBaseTree(x, y);
    const node = this.findNodeById(y);
    node.parentNodeId = undefined;
    return this;
}

BaseTree.prototype.text = function(arg0, arg1) {
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new Error("Invalid Arguments");
    }
    const value = this.element.apply(this, arguments).value();
    if (value === undefined) {
        return "";
    }
    if (!value.text) {
        if (arguments.length === 1) {
            throw new Error(`Cannot Get The Text On Element ${arg0}`);
        }
        if (arguments.length === 2) {
            throw new Error(`Cannot Get The Text On Element ${arg0} ${arg1}`);
        }
    }
    return value.text();
}

BaseTree.prototype.intValue = function() {
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new Error("Invalid Arguments");
    }
    const value = this.element.apply(this, arguments).value();
    if (value === undefined) {
        return 0;
    }
    if (!value.text) {
        if (arguments.length === 1) {
            throw new Error(`Cannot Get The Text On Element ${arg0}`);
        }
        if (arguments.length === 2) {
            throw new Error(`Cannot Get The Text On Element ${arg0} ${arg1}`);
        }
    }
    return +value.text();
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

BaseTree.prototype.forEachNodes = function(callback) {
    const nodes = this.member.get("nodes");
    nodes.forEach(node => {
        callback(node, node.nodeId);
    });
}