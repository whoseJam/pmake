import { Line }                 from "@/Node/Nake/Line";
import { SDNode }               from "@/Node/SDNode";
import { Vertex }               from "@/Node/Element/Vertex";
import { naiveGetterAndSetter } from "@/Node/Common";

export function BaseGraph(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 300);
    this.member.new("height", 300);
    this.member.new("links", []);
    this.member.new("nodes", []);
    this._.nodeType = Vertex;
    this._.linkType = Line;
    this.newLayer("nodes");
    this.newLayer("links");
}

BaseGraph.prototype = {
    ...SDNode.prototype
};

BaseGraph.prototype.x      = naiveGetterAndSetter("x", "setByEqual");
BaseGraph.prototype.y      = naiveGetterAndSetter("y", "setByEqual");
BaseGraph.prototype.width  = naiveGetterAndSetter("width", "setByEqual");
BaseGraph.prototype.height = naiveGetterAndSetter("height", "setByEqual");

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

BaseGraph.prototype.opacity = function(arg0, arg1, arg2) {
    if (arguments.length === 0) {
        return SDNode.prototype.opacity.call(this);
    } else if (arguments.length === 1) {
        let v = arguments[0];
        if (0 <= v && v <= 1) SDNode.prototype.opacity.call(this, v);
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

BaseGraph.prototype.findNodeById = function(nodeId) {
    const targetNodeId = String(nodeId);
    const nodes = this.member.get("nodes");
    return nodes.find(node => String(node.nodeId) === targetNodeId);
}

BaseGraph.prototype.findLinkById = function(fromNodeId, toNodeId) {
    const targetFromNodeId = String(fromNodeId);
    const targetToNodeId = String(toNodeId);
    const links = this.member.get("links");
    return links.find(link => String(link.fromNodeId) === targetFromNodeId && String(link.toNodeId) === targetToNodeId);
}

BaseGraph.prototype.inNodes = function(x, mode = "direct") {
    const targetToNodeId = String(x);
    const links = this.inLinks(x, mode);
    const mapper = (mode === "direct") ?
        link => String(link.fromNodeId) :
        link => String(link.toNodeId) === targetToNodeId ? String(link.fromNodeId) : String(link.toNodeId);
    const ins = links.map(mapper);
    return [...new Set(ins)].map(nodeId => this.findNodeById(nodeId));
}

BaseGraph.prototype.inLinks = function(x, mode = "direct") {
    const targetToNodeId = String(x);
    const links = this.member.get("links");
    const filter = (mode === "direct") ? 
        link => String(link.toNodeId) === targetToNodeId :
        link => String(link.toNodeId) === targetToNodeId || String(link.fromNodeId) === targetToNodeId;
    const ins = links.filter(filter);
    return ins;
}

BaseGraph.prototype.outNodes = function(x, mode = "direct") {
    const targetFromNodeId = String(x);
    const links = this.outLinks(x, mode);
    const mapper = (mode === "direct") ?
        link => String(link.toNodeId) :
        link => String(link.fromNodeId) === targetFromNodeId ? String(link.toNodeId) : String(link.fromNodeId);
    const outs = links.map(mapper)
    return [...new Set(outs)].map(nodeId => this.findNodeById(nodeId));
}

BaseGraph.prototype.outLinks = function(x, mode = "direct") {
    const targetFromNodeId = String(x);
    const links = this.member.get("links");
    const filter = (mode === "direct") ? 
        link => String(link.fromNodeId) === targetFromNodeId :
        link => String(link.fromNodeId) === targetFromNodeId || String(link.toNodeId) === targetFromNodeId;
    const outs = links.filter(filter);
    return outs;
}

BaseGraph.prototype.newNodeByBaseGraph = function(id, elem) {
    elem.nodeId = id;
    this.member.get("nodes").push(elem);
    this.children.push(elem);
    this.tryUpdate();
    return this;
}

BaseGraph.prototype.newLinkByBaseGraph = function(x, y, elem) {
    elem.fromNodeId = x;
    elem.toNodeId = y;
    this.member.get("links").push(elem);
    this.children.push(elem);
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
    return this.member.get("nodes");
}

BaseGraph.prototype.links = function() {
    return this.member.get("links");
}

BaseGraph.prototype.nodesId = function() {
    const nodesId = this.member.get("nodes").map(node => node.nodeId);
    return [...new Set(nodesId)];
}

BaseGraph.prototype.toNodeId = function(fromNodeId, link) {
    const targetFromNodeId = String(fromNodeId);
    if (String(link.fromNodeId) === targetFromNodeId) return link.toNodeId;
    return link.fromNodeId;
}
