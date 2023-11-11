import { Traiter } from "../../Utility/TypeTrait";
import { Link } from "../Link/Link";
import { Vertex } from "../Element/Vertex";
import { SDHelper } from "../../Utility/SDHelper";
import { Text } from "../Basic/Text";

export function encode(x, y) {
    return x + "%%" + y;
}

export function AbsGraph(self) {
    self.linkType = SDHelper.keyValueFunc(self, "linkType", Link);
    self.nodeType = SDHelper.keyValueFunc(self, "nodeType", Vertex);
    self.element = element;
    self.value = value;
    self.color = color;
    self.opacity = opacity;
    self.newNode = newNode;
    self.newLink = newLink;
    
    self._.links = {};
    self._.nodes = {};
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self.mode = SDHelper.keyValueFunc(self, "mode", "strong");

    self.nodePreIn = SDHelper.keyValueFunc(self, "nodePreIn", () => {});
    self.nodeIn = SDHelper.keyValueFunc(self, "nodeIn", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.nodePreOut = SDHelper.keyValueFunc(self, "nodePreOut", () => {});
    self.nodeOut = SDHelper.keyValueFunc(self, "nodeOut", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    });
    self.linkPreIn = SDHelper.keyValueFunc(self, "linkPreIn", () => {});
    self.linkIn = SDHelper.keyValueFunc(self, "linkIn", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.linkPreOut = SDHelper.keyValueFunc(self, "linkPreOut", () => {});
    self.linkOut = SDHelper.keyValueFunc(self, "linkOut", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    })

    return self;
}

function element1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this._.nodes[nodeId].node;
    throw new Error("invalid arguments");
}
function element2(v1, v2) {
    if (v1 === "node") return element1.call(this, v2);
    return this._.links[encode(v1, v2)].link;
}
function element3(v1, v2, v3) {
    if (v1 !== "link") throw new Error("invalid arguments");
    return element2.call(this, v2, v3);
}
function element() {
    if (arguments.length === 1) return element1.apply(this, arguments);
    if (arguments.length === 2) return element2.apply(this, arguments);
    if (arguments.length === 3) return element3.apply(this, arguments);
    throw new Error("invalid arguments");
}


function value1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this._.nodes[nodeId].node.value();
    throw new Error("invalid arguments");
}
function value2(v1, v2) {
    if (SDHelper.isSlide(v2)) {
        element1.call(this, v1).value(v2);
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2)) {
        let idx = encode(v1, v2);
        if (this._.links[idx] !== undefined)
            return this._.links[idx].link.value();
        element1.call(this, v1).value(Text(this, v2));
        return this;
    }
    throw new Error("invalid arguments");
}
function value3(v1, v2, v3) {
    v3 = SDHelper.any2Slide(v3);
    element2.call(this, v1, v2).value(v3);
    return this;
}
function value() {
    if (arguments.length === 1) return value1.apply(this, arguments);
    if (arguments.length === 2) return value2.apply(this, arguments);
    if (arguments.length === 3) return value3.apply(this, arguments);
    throw new Error("invalid arguments");
}

function opacity1(v1) {
    if (SDHelper.isOpacity(v1)) {
        SDHelper.opacity.call(this, v1);
        return this;
    } else if (SDHelper.isText(v1))
        return this._.nodes[nodeId].node.opacity();
    throw new Error("invalid arguments");
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
function opacity() {
    if (arguments.length === 1) return opacity1.apply(this, arguments);
    if (arguments.length === 2) return opacity2.apply(this, arguments);
    if (arguments.length === 3) return opacity3.apply(this, arguments);
    throw new Error("invalid arguments"); 
}

function color1(v1) {
    if (SDHelper.isColor(v1)) {
        for (let id in this._.nodes)
            this._.nodes[id].node.color(v1);
        return this;
    } else if (SDHelper.isText(v1))
        return this._.nodes[nodeId].node.color();
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
function color() {
    if (arguments.length === 1) return color1.apply(this, arguments);
    if (arguments.length === 2) return color2.apply(this, arguments);
    if (arguments.length === 3) return color3.apply(this, arguments);
    throw new Error("invalid arguments"); 
}

function newNode(id, value) {
    if (value === undefined) value = id;
    value = SDHelper.any2Slide(this, value);
    let nodes = this._.nodes;
    let group = this.layer("nodes");
    let node = {
        id: id,
        isFirst: true,
        node: this._.nodeType(group),
    };
    node.node.value(value);
    nodes[id] = node;
    this.extNewNode(node);
    this.children.push(node.node);
    this.update();
    return this;
}

function newLink(x, y, value = null) {
    value = SDHelper.any2Slide(this, value);
    let idx = encode(x, y);
    let links = this._.links;
    let group = this.layer("links");
    let link = {
        link: this._.linkType(group),
        source: x,
        target: y,
        isFirst: true
    };
    if (value) link.link.value(value);
    links[idx] = link;
    this.extNewLink(link);
    this.children.push(link.link);
    this.update();
    return this;
}

