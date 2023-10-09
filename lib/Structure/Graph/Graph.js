import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Link } from "../Element/Link";
import { Vertex } from "../Element/Vertex";
import { AbsGraph, encode } from "./AbsGraph";
import { Text } from "../Basic/Text";
import { trim } from "../../Utility/Trim";
import { Traiter } from "../../Utility/TypeTrait";
import * as d3 from "d3";

const GRAPH_ALPHA = 0.5;

export function Graph(node) {
    let self = {};

    self = Node(self, node);
    self = AbsGraph(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));

    self.set("links", {});
    self.set("nodes", {});
    self.set("nodeType", Vertex);
    self.set("linkType", Link);
    
    self.extWidth = () => {};
    self.extHeight = () => {};
    self.newLink = newLink;
    self.newNode = newNode;
    self.link = link;
    self.update = update;
    self.type = () => { return "Graph"; };

    let simu = d3.forceSimulation([]);
    simu.force("link", linkForce.call(self));
    simu.force("charge", manyBodyForce.call(self));
    simu.force("center", centerForce.call(self));
    simu.on("tick", onTick.bind(self));
    self.set("simulation", simu);

    self.width(300);
    self.height(300);
    self.g().attr("name", "Graph");

    self.startAnimate = () => {};
    self.endAnimate = () => {};
    
    return self;
}

function onTick() {
    let links = this.get("links");
    let nodes = this.get("nodes");
    for (let i in links) {
        for (let j = 0; j < links[i].length; j++) {
            let link = links[i][j];
            let source = nodes[link.source.id];
            let target = nodes[link.target.id];
            // link.link.endAnimate();
            link.link.source(source.x, source.y);
            link.link.target(target.x, target.y);
            trim(link.link, source.node, target.node);
        }
    }
    for (let i in nodes) {
        let node = nodes[i].node;
        // node.endAnimate();
        node.cx(nodes[i].x);
        node.cy(nodes[i].y);
    }
}

function newNode(id, value = null) {
    let nodes = this.get("nodes");
    let simulation = this._.simulation;
    let group = this.layer("nodes");
    let node = { id: id, is_first: true, node: this.nodeType()(group) }
    nodes[id] = node;
    node.node.value(value);
    node.node.width(40);
    node.node.drag({
        start: () => { 
            simulation.alpha(GRAPH_ALPHA).restart();
            node.fx = node.x; node.fy = node.y; },
        drag: (e) => { node.fx += e.dx; node.fy += e.dy; },
        end: () => { node.fx = node.fy = null; }
    });
    this.children.push(node.node);
    return node;
}

function newLink(x, y, value = null) {
    let idx = encode(x, y);
    let links = this.get("links");
    let link = { 
        link: Link(this.layer("links")).value(value), 
        source: x, target: y, 
        is_first: true };
    if (links[idx] === undefined)
        links[idx] = [];
    links[idx].push(link);
    this.children.push(link.link);
    return link;
}

function update() {
    let nodes = this._.nodes;
    let flattenNodes = [];
    for (let id in nodes) {
        nodes[id].index = id;
        flattenNodes.push(nodes[id]);
    }
    this._.simulation.alpha(GRAPH_ALPHA);
    this._.simulation.nodes(flattenNodes)
                     .force("link", linkForce.call(this))
                     .force("center", centerForce.call(this));
    this._.simulation.restart();
    this.isDirty = false;
    this.children.update();
}

function link(x, y) {
    let group = this.get("group");
    let nodes = this._.nodes;
    if (Traiter.isText(x) && Traiter.isText(y)) {
        if (nodes[x] === undefined) this.newNode(x, Text(group, x));
        if (nodes[y] === undefined) this.newNode(y, Text(group, y));
        this.newLink(x, y);
        this.update();
    } else if (typeof(x) === "object") {
        let conf = x; x = conf.source; y = conf.target;
        if (typeof(nodes[x]) === "undefined") this.newNode(x, Text(group, x));
        if (typeof(nodes[y]) === "undefined") this.newNode(y, Text(group, y));
        let link = this.newLink(x, y);
        this.update();
    }
    return this;
}

function linkForce() {
    let links = this.get("links");
    let flattenLinks = [];
    for (let i in links)
        for (let j = 0; j < links[i].length; j++)
            flattenLinks.push(links[i][j]);
    return d3.forceLink(flattenLinks).id((data) => { return data.id; }).distance(100).strength(0.1);
}
function manyBodyForce() { return d3.forceManyBody().strength(-30); }
function centerForce() { return d3.forceCenter(this.cx(), this.cy()).strength(1); }