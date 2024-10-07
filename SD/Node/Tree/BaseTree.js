import { SDNode } from "@/Node/SDNode";

import { Check } from "@/Utility/Check";

export function BaseTree(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("links", []);
    this.member.new("nodes", []);

    this._.sidToNodes = {}; // id of SDNode -> { node: SDNode, key: id on Tree }
    this._.sidToLinks = {}; // id of SDNode -> { link: SDNode, source: id on Tree, target: id on Tree }
    this._.tidToNodes = {}; // id on Tree -> { node: SDNode, key: id of SDNode }

    this._.BASE_TREE = true;
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
        if (Check.isNumberOrString(arg0) && Check.isNumberOrString(arg1)) {
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

BaseTree.prototype.findNodeById = function(tid) {
    tid = String(tid);
    const tidToNodes = this._.tidToNodes;
    const node = tidToNodes[tid];
    if (node === undefined) return node;
    return tidToNodes[tid].node;
}

BaseTree.prototype.findLinkById = function(sourceTid, targetTid) {
    sourceTid = String(sourceTid);
    targetTid = String(targetTid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    for (let i = 0; i < links.length; i++) {
        if (sidToLinks[links[i].id].source === sourceTid &&
            sidToLinks[links[i].id].target === targetTid) {
            return sidToLinks[links[i].id].link;
        }
    }
    return undefined;
}

BaseTree.prototype.inLink = function(tid) {
    if (Check.isTypeOfSDNode(tid)) {
        return this.inLink(this._.sidToNodes[tid.id].key);
    }
    tid = String(tid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    for (let link of links) {
        if (sidToLinks[link.id].target === tid) {
            return link;
        }
    }
    return undefined;
}

BaseTree.prototype.outLinks = function(tid) {
    if (Check.isTypeOfSDNode(tid)) {
        return this.outLinks(this._.sidToNodes[tid.id].key);
    }
    tid = String(tid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    return links.filter(link => sidToLinks[link.id].source === tid);
}

BaseTree.prototype.stratify = function() {
    const result = {};
    const root = this.root();
    const dfs = (current, depth) => {
        let height = depth;
        const children = [];
        this.children(current).forEach(child => {
            child.depth = current.depth + 1;
            height = Math.max(height, dfs(child, depth + 1));
            children.push(result[this.nodeId(child)]);
        });
        result[this.nodeId(current)] = {
            id: this.nodeId(current),
            children: children,
            depth: depth,
            height: height
        };
        return height;
    }
    dfs(root, 1);
    return result[this.nodeId(root)];
}

BaseTree.prototype.father = function(arg) {
    if (Check.isNumberOrString(arg)) {
        const link = this.inLink(arg);
        if (link === undefined) return link;
        return this.findNodeById(this._.sidToLinks[link.id].source);
    } else if (Check.isTypeOfSDNode(arg)) {
        const sidToNodes = this._.sidToNodes;
        const sidToLinks = this._.sidToLinks;
        if (sidToNodes[arg.id]) {
            return this.father(sidToNodes[arg.id].key);
        } else {
            return this.findNodeById(sidToLinks[arg.id].source);
        }
    }
}

BaseTree.prototype.fatherId = function(arg) {
    return this.nodeId(this.father(arg));
}

BaseTree.prototype.depth = function(u) {
    if (u === undefined) {
        const root = this.stratify();
        return root ? root.height : 0;
    }
    let depth = 1;
    while (this.father(u)) {
        u = this.father(u);
        depth++;
    }
    return depth;
}

BaseTree.prototype.lca = function(x, y) {
    x = this.nodeId(x);
    y = this.nodeId(y);
    let dx = this.depth(x);
    let dy = this.depth(y);
    for (let i = 1; i <= 100 && x !== y; i++) {
        if (dx > dy) {
            x = this.fatherId(x);
            dx--;
        } else {
            y = this.fatherId(y);
            dy--;
        }
    }
    return this.findNodeById(x);
}

BaseTree.prototype.lcaId = function(x, y) {
    return this.nodeId(this.lca(x, y));
}

BaseTree.prototype.children = function(tid) {
    if (Check.isTypeOfSDNode(tid)) {
        return this.children(this.nodeId(tid));
    }
    return this.outLinks(tid).map(link => this.findNodeById(this._.sidToLinks[link.id].target));
}

BaseTree.prototype.newNodeByBaseTree = function(tid, element) {
    const sidToNodes = this._.sidToNodes;
    const tidToNodes = this._.tidToNodes;
    tidToNodes[tid] = { node: element, key: element.id };
    sidToNodes[element.id] = { node: element, key: String(tid) };

    this.member.get("nodes").push(element);
    this.member.dirty("nodes");
    this._.children.push(element);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.newLinkByBaseTree = function(sourceTid, targetTid, element) {
    const sidToLinks = this._.sidToLinks;
    sidToLinks[element.id] = { link: element, source: String(sourceTid), target: String(targetTid) };
    
    this.member.get("links").push(element);
    this.member.dirty("links");
    this._.children.push(element);
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
        return nodes.find(node => this.father(node) === undefined);
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

BaseTree.prototype.forEachNodes = function(callback) {
    this.member.get("nodes").forEach(node => callback(node, this.nodeId(node)));
}

BaseTree.prototype.forEachLinks = function(callback) {
    this.member.get("links").forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
}

BaseTree.prototype.rootId = function() {
    return this.nodeId(this.root());
}

BaseTree.prototype.nodeId = function(node) {
    if (Check.isTypeOfSDNode(node)) {
        return this._.sidToNodes[node.id].key;
    }
    return node;
}

BaseTree.prototype.sourceId = function(link) {
    return this._.sidToLinks[link.id].source;
}

BaseTree.prototype.targetId = function(link) {
    return this._.sidToLinks[link.id].target;
}

BaseTree.prototype.source = function(link) {
    return this.findNodeById(this.sourceId(link));
}

BaseTree.prototype.target = function(link) {
    return this.findNodeById(this.targetId(link));
}