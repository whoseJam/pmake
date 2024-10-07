import { Line }   from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";
import { Vertex } from "@/Node/Element/Vertex";

export function BaseGraph(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 300);
    this.member.new("height", 300);
    this.member.new("links", []);
    this.member.new("nodes", []);

    this._.sidToLinks = {};  // id of SDNode -> { link: link, source: id on Graph, target: id on Graph }
    this._.sidToNodes = {};  // id of SDNode -> { node: node, key: id on Graph }
    this._.gidToNodes = {};  // id on Graph -> { node: node, key: id of SDNode }
    this._.nodeType = Vertex;
    this._.linkType = Line;
    
    this.newLayer("nodes");
    this.newLayer("links");

    this._.BASE_GRAPH = true;
}

BaseGraph.prototype = {
    ...SDNode.prototype
};

BaseGraph.prototype.x      = SDNode.OrdinaryGSet("x", "setByEqual");
BaseGraph.prototype.y      = SDNode.OrdinaryGSet("y", "setByEqual");
BaseGraph.prototype.width  = SDNode.OrdinaryGSet("width", "setByEqual");
BaseGraph.prototype.height = SDNode.OrdinaryGSet("height", "setByEqual");

BaseGraph.prototype.element = function(arg0, arg1) {
    if (arguments.length === 1)
        return this.findNodeById(arg0);
    else if (arguments.length === 2)
        return this.findLinkById(arg0, arg1);
    console.error(arguments);
    throw new Error("Invalid Arguments");
}

BaseGraph.prototype.value = function(arg0, arg1, arg2) {
    if (arguments.length === 1) 
        return this.findNodeById(arg0).value();
    else if (arguments.length === 2) {
        const link = this.findLinkById(arg0, arg1);
        if (link) return link.value();
        this.findNodeById(arg0).value(arg1);
        return this;
    } else if (arguments.length === 3) {
        this.findLinkById(arg0, arg1).value(arg2);
        return this;
    }
    console.error(arguments);
    throw new Error("Invalid Arguments");
}

BaseGraph.prototype.text = function() {
    return this.value.apply(this, arguments).text();
}

BaseGraph.prototype.opacity = function(arg0, arg1, arg2) {
    if (arguments.length === 0) {
        return SDNode.prototype.opacity.call(this);
    } else if (arguments.length === 1) {
        let v = arguments[0];
        if (0 <= v && v <= 1) return SDNode.prototype.opacity.call(this, v);
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

BaseGraph.prototype.color = function(arg0, arg1, arg2) {
    if (arguments.length === 1) {
        if (typeof(arg0) === "string" || "main" in arg0) {
            this.member.get("nodes").forEach(node => node.color(arg1));
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

BaseGraph.prototype.findNodeById = function(gid) {
    gid = String(gid);
    const gidToNodes = this._.gidToNodes;
    const node = gidToNodes[gid];
    if (node === undefined) return node;
    return gidToNodes[gid].node;
}

BaseGraph.prototype.findLinkById = function(sourceGid, targetGid) {
    sourceGid = String(sourceGid);
    targetGid = String(targetGid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    for (let i = 0; i < links.length; i++) {
        if (sidToLinks[links[i].id].source === sourceGid &&
            sidToLinks[links[i].id].target === targetGid) {
            return sidToLinks[links[i].id].link;
        }
    }
    return undefined;
}

BaseGraph.prototype.inLinks = function(gid, mode = "direct") {
    gid = String(gid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    const filter = (mode === "direct") ? 
        link => sidToLinks[link.id].target === gid :
        link => sidToLinks[link.id].target === gid || sidToLinks[link.id].source === gid;
    return links.filter(filter);
}

BaseGraph.prototype.outLinks = function(gid, mode = "direct") {
    gid = String(gid);
    const links = this.member.get("links");
    const sidToLinks = this._.sidToLinks;
    const filter = (mode === "direct") ? 
        link => sidToLinks[link.id].source === gid :
        link => sidToLinks[link.id].target === gid || sidToLinks[link.id].source === gid;
    return links.filter(filter);
}

BaseGraph.prototype.inNodes = function(gid, mode = "direct") {
    gid = String(gid);
    return [...new Set(this.inLinks(gid, mode).map(link => this.toNode(link, gid)))];
}

BaseGraph.prototype.outNodes = function(gid, mode = "direct") {
    gid = String(gid);
    return [...new Set(this.outLinks(gid, mode).map(link => this.toNode(link, gid)))];
}

BaseGraph.prototype.inNodesId = function(gid, mode = "direct") {
    return this.inNodes(gid, mode).map(node => this.nodeId(node));
}

BaseGraph.prototype.outNodesId = function(gid, mode = "direct") {
    return this.outNodes(gid, mode).map(node => this.nodeId(node));
}

BaseGraph.prototype.newNodeByBaseGraph = function(gid, element) {
    const sidToNodes = this._.sidToNodes;
    const gidToNodes = this._.gidToNodes;
    sidToNodes[element.id] = { node: element, key: String(gid) };
    gidToNodes[gid] = { node: element, key: element.id };
    this.member.get("nodes").push(element);
    this.member.dirty("nodes");
    this.children.push(element);
    this.tryUpdate();
    return this;
}

BaseGraph.prototype.newLinkByBaseGraph = function(sourceGid, targetGid, element) {
    const sidToLinks = this._.sidToLinks;
    sidToLinks[element.id] = { link: element, source: String(sourceGid), target: String(targetGid) };
    this.member.get("links").push(element);
    this.member.dirty("links");
    this.children.push(element);
    this.tryUpdate();
    return this;
}

BaseGraph.prototype.link = function(x, y, value = null) {
    if (!this.findNodeById(y)) this.newNode(y);
    if (!this.findNodeById(x)) this.newNode(x);
    this.newLink(x, y, value);
    return this;
}

BaseGraph.prototype.cut = function(x, y) {
    const links = this.member.get("links");
    let link = this.findLinkById(x, y);
    let idx = links.indexOf(link);
    links.splice(idx, 1);
    this.children.erase(link);
    link.opacity(0).remove();
    this.tryUpdate();
    return this;
}

BaseGraph.prototype.nodes = function() {
    return [...this.member.get("nodes")];
}

BaseGraph.prototype.nodeId = function(node) {
    const sidToNodes = this._.sidToNodes;
    return sidToNodes[node.id].key;
}

BaseGraph.prototype.links = function() {
    return [...this.member.get("links")];
}

BaseGraph.prototype.sourceId = function(link) {
    const sidToLinks = this._.sidToLinks;
    return sidToLinks[link.id].source;
}

BaseGraph.prototype.targetId = function(link) {
    const sidToLinks = this._.sidToLinks;
    return sidToLinks[link.id].target;
}

BaseGraph.prototype.nodesId = function() {
    const nodesId = this.member.get("nodes").map(node => node.nodeId);
    return [...new Set(nodesId)];
}

BaseGraph.prototype.toNode = function(link, sourceGid) {
    const sidToLinks = this._.sidToLinks;
    const gidToNodes = this._.gidToNodes;
    link = sidToLinks[link.id];
    return gidToNodes[(link.source === String(sourceGid)) ? link.target : link.source].node;
}

BaseGraph.prototype.toNodeId = function(link, sourceGid) {
    return this.nodeId(this.toNode(link, sourceGid))
}
