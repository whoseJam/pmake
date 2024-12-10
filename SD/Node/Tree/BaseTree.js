import { SDNode } from "@/Node/SDNode";

import { Check }         from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

function CastIntoId(tree, object) {
    return (Check.isTypeOfSDNode(object)) ? tree.nodeId(object) : object;
}

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

BaseTree.prototype.element = function() {
    const args = arguments;
    switch (args.length) {
        case 1:
            if (Check.isTypeOfSDNode(args[0])) return args[0];
            const node = this.findNodeById(args[0]);
            return node ? node : ErrorLauncher.nodeNotExists(args[0]);
        case 2:
            const link = this.findLinkById(CastIntoId(this, args[0]), CastIntoId(this, args[1]));
            return link ? link : 
                          ErrorLauncher.linkNotExist(CastIntoId(this, args[0]), CastIntoId(this, args[1]));
        default:
            ErrorLauncher.invalidArguments();
    }
}

BaseTree.prototype.value = function() {
    const args = arguments;
    switch (args.length) {
        case 1: {
            const node = this.element(args[0]);
            return node ? node.value() : ErrorLauncher.nodeNotExists(args[0]);
        }
        case 2: {
            const link = this.findLinkById(CastIntoId(this, args[0]), CastIntoId(this, args[1]));
            const node = this.findNodeById(CastIntoId(this, args[0]));
            return link ? link.value() : 
                   node ? (node.value(args[1]), this) : 
                   ErrorLauncher.nodeNotExists(CastIntoId(this, args[0]));
        }
        case 3: {
            const link = this.findLinkById(CastIntoId(this, args[0]), CastIntoId(this, args[1]));
            return link ? (link.value(args[2]), this) : 
                          ErrorLauncher.linkNotExist(CastIntoId(this, args[0]), CastIntoId(this, args[1]));
        }
        default:
            ErrorLauncher.invalidArguments();
    }
}

BaseTree.prototype.opacity = function() {
    const args = arguments;
    switch (args.length) {
        case 0:
            return SDNode.prototype.opacity.call(this);
        case 1:
            return Check.isTypeOfOpacity(args[0]) ? SDNode.prototype.opacity.call(this, args[0]) : this.element(args[0]).opacity();
        case 2:
            return Check.isTypeOfOpacity(args[1]) ? this.element(args[0]).opacity(args[1]) : this.element(args[0], args[1]).opacity();
        case 3:
            return (this.element(args[0], args[1]).opacity(args[2]), this);
        default:
            ErrorLauncher.invalidArguments();
    }
}

BaseTree.prototype.color = function() {
    const args = arguments;
    switch (args.length) {
        case 1: {
            const node = this.findNodeById(args[0]);
            return node ? node.color() : (this.forEachNodes(node => node.color(args[0])), this);
        }
        case 2: {
            const node = this.findNodeById(args[0]);
            const link = this.findLinkById(args[0], args[1]);
            return link ? link.color() : 
                   Check.isTypeOfColor(args[1]) ? (node.color(args[1]), this) : 
                   ErrorLauncher.invalidArguments();
        }
        case 3: {
            const link = this.findLinkById(args[0], args[1]);
            return link ? link.color(args[2]) : ErrorLauncher.linkNotExist(args[0], args[1]);
        }
        default:
            ErrorLauncher.invalidArguments();
    }
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
    if (!root) return undefined;
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
            height: height,
            data: current
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
    } else return undefined;
}

BaseTree.prototype.fatherId = function(arg) {
    return this.nodeId(this.father(arg));
}

BaseTree.prototype.ancestor = function(node, kth) {
    node = this.element(node);
    for (let i = 1; i <= kth; i++) {
        node = this.father(node);
    }
    return node;
}

BaseTree.prototype.ancestorId = function(node, kth) {
    return this.nodeId(this.ancestor(node, kth));
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
    tidToNodes[String(tid)] = { node: element, key: element.id };
    sidToNodes[element.id] = { node: element, key: String(tid) };
    this.member.get("nodes").push(element);
    this.member.dirty("nodes");
    this.childAs(element);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.newLinkByBaseTree = function(sourceTid, targetTid, element) {
    const sidToLinks = this._.sidToLinks;
    sidToLinks[element.id] = { link: element, source: String(sourceTid), target: String(targetTid) };
    
    this.member.get("links").push(element);
    this.member.dirty("links");
    this.childAs(element);
    this.tryUpdate();
    return this;
}

BaseTree.prototype.eraseLinkByBaseTree = function(x, y) {
    const link = this.findLinkById(x, y);
    const links = this.member.get("links");
    const index = links.indexOf(link);
    links.splice(index, 1);
    this._.children.erase(link);
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

BaseTree.prototype.nodesOnPath = function(source, target) {
    source = this.element(source); const sourceList = [];
    target = this.element(target); const targetList = [];
    let sourceDepth = this.depth(source);
    let targetDepth = this.depth(target);
    for (let i = 1; i <= 100 && source !== target; i++) {
        if (sourceDepth > targetDepth) {
            sourceList.push(source);
            source = this.father(source);
            sourceDepth--;
        } else {
            targetList.push(target);
            target = this.father(target);
            targetDepth--;
        }
    }
    return [...sourceList, source, ...targetList.reverse()];
}

BaseTree.prototype.linksOnPath = function(source, target) {
    source = this.element(source); const sourceList = [];
    target = this.element(target); const targetList = [];
    let sourceDepth = this.depth(source);
    let targetDepth = this.depth(target);
    for (let i = 1; i <= 100 && source !== target; i++) {
        if (sourceDepth > targetDepth) {
            sourceList.push(this.element(this.father(source), source));
            source = this.father(source);
            sourceDepth--;
        } else {
            targetList.push(this.element(this.father(target), target));
            target = this.father(target);
            targetDepth--;
        }
    }
    return [...sourceList, ...targetList.reverse()];
}

BaseTree.prototype.forEachNodesOnPath = function(source, target, callback) {
    this.nodesOnPath(source, target).forEach(node => callback(node, this.nodeId(node)));
    return this;
}

BaseTree.prototype.forEachLinksOnPath = function(source, target, callback) {
    this.linksOnPath(source, target).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    return this;
}

BaseTree.prototype.forEachNodes = function(callback) {
    this.member.get("nodes").forEach(node => callback(node, this.nodeId(node)));
    return this;
}

BaseTree.prototype.forEachLinks = function(callback) {
    this.member.get("links").forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    return this;
}

BaseTree.prototype.rootId = function() {
    return this.nodeId(this.root());
}

BaseTree.prototype.nodeId = function(node) {
    return Check.isTypeOfSDNode(node) ?
        (this._.sidToNodes[node.id] ? this._.sidToNodes[node.id].key : undefined) :
        (node === undefined ? undefined : String(node));
}

BaseTree.prototype.sourceId = function(link) {
    return this._.sidToLinks[link.id] ? this._.sidToLinks[link.id].source : undefined;
}

BaseTree.prototype.targetId = function(link) {
    return this._.sidToLinks[link.id] ? this._.sidToLinks[link.id].target : undefined;
}

BaseTree.prototype.source = function(link) {
    const sourceId = this.sourceId(link);
    return sourceId !== undefined ? sourceId : ErrorLauncher.linkNotExist("?", "?");
}

BaseTree.prototype.target = function(link) {
    const targetId = this.targetId(link);
    return targetId !== undefined ? targetId : ErrorLauncher.linkNotExist("?", "?")
}