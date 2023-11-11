import { SDHelper } from "../../Utility/SDHelper";
import { Traiter } from "../../Utility/TypeTrait";
import { Text } from "../Basic/Text";
import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";

export function encode(x, y) {
    return x + "%%" + y;
}

export function AbsTree(self) {
    self.linkType = SDHelper.keyValueFunc(self, "linkType", Link);
    self.nodeType = SDHelper.keyValueFunc(self, "nodeType", Vertex);
    self.element = element;
    self.value = value;
    self.color = color;
    self.opacity = opacity;
    self.father = father;
    self.root = root;
    self.link = link;

    self._.links = {};
    self._.nodes = {};

    self.nodePreIn = SDHelper.keyValueFunc(self, "nodePreIn", SDHelper.emptyFunc);
    self.nodeIn = SDHelper.keyValueFunc(self, "nodeIn", (elem) => {
        elem.opacity(0)
        elem.startAnimate(self)
        elem.opacity(1);
    });
    self.nodePreOut = SDHelper.keyValueFunc(self, "nodePreOut", SDHelper.emptyFunc);
    self.nodeOut = SDHelper.keyValueFunc(self, "nodeOut", (elem) => {
        elem.opacity(0)
            .remove();
    });
    self.linkPreIn = SDHelper.keyValueFunc(self, "linkPreIn", SDHelper.emptyFunc);
    self.linkIn = SDHelper.keyValueFunc(self, "linkIn", (elem) => {
        elem.opacity(0)
            .startAnimate(self)
            .opacity(1);
    });
    self.linkPreOut = SDHelper.keyValueFunc(self, "linkPreOut", () => {});
    self.linkOut = SDHelper.keyValueFunc(self, "linkOut", (elem) => {
        elem.opacity(0)
            .remove();
    })

    self.newLink = newLink;
    self.newNode = newNode;

    return self;
}

function root(id, value) {
    this.newNode(id, value);
    return this;
}

function link(x, y, value = null) {
    if (this._.nodes[y] === undefined)
        this.newNode(y);
    this.newLink(x, y, value);
    return this;
}

function father(id) {
    let nodes = this.get("nodes");
    let node = nodes[id];
    return node.parent;
}

function element1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this._.nodes[nodeId].node;
    throw new Error("invalid arguments");
}
function element2(v1, v2) {
    return this._.links[encode(v1, v2)].link;
}
function element() {
    if (arguments.length === 1) return element1.apply(this, arguments);
    if (arguments.length === 2) return element2.apply(this, arguments);
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
        if (this._.links[idx] != undefined)
            return this._.links[idx].link.value();
        element1.call(this, v1).value(Text(this, v2));
        return this;
    }
    throw new Error("invalid arguments");
}
function value() {
    if (arguments.length === 1) return value1.apply(this, arguments);
    if (arguments.length === 2) return value2.apply(this, arguments);
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
        parent: "",
        id: id,
        node: this._.nodeType(group),
        isFirst: true
    };
    node.node.value(value);
    nodes[id] = node;
    this.extNewNode(node);
    this.children.push(node.node);
    this.update();
    return this;
}

function newLink(x, y, value = null) {
    let links = this._.links;
    let group = this.layer("links");
    value = SDHelper.any2Slide(this, value);
    this._.nodes[y].parent = x;
    let idx = encode(x, y);
    let link = {
        parent: x,
        id: x,
        link: this._.linkType(group)
    }
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
    this.update();
    return this;
}