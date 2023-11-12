import { SDHelper } from "../../Utility/SDHelper";
import { Traiter } from "../../Utility/TypeTrait";
import { Text } from "../Basic/Text";
import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";

export function encode(x, y) {
    return x + "%%" + y;
}

export function AbsTree(self) {
    self.fromExistedElem = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedElem", false);
    self.fromExistedValue = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedValue", false);
    self.linkType = SDHelper.keyValueFunc(self, "linkType", Link);
    self.nodeType = SDHelper.keyValueFunc(self, "nodeType", Vertex);
    self.element = element;
    self.value = value;
    self.color = color;
    self.opacity = opacity;
    self.father = father;
    self.root = root;
    self.link = link;
    self.cut = cut;

    self._.links = {};
    self._.nodes = {};

    self.newLink = newLink;
    self.newNode = newNode;

    return self;
}

function root(id, value) {
    this.newNode(id, value);
    this._.nodes[id].preIn();
    this.update();
    this._.nodes[id].in();
    return this;
}

function link(x, y, value = null) {
    if (this._.nodes[y] === undefined)
        this.newNode(y);
    this.newLink(x, y, value);
    return this;
}

function cut(x, y) {
    let link = this._.links[encode(x, y)].link;
    this.children.erase(link);
    delete this._.links[encode(x, y)];
    link.opacity(0).remove();
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
    let elem;
    if (value === undefined) value = id;
    if (this._.nodeType) value = SDHelper.any2Slide(this, value);
    if (this._.fromExistedElem) elem = value;
    else if (this._.nodeType) elem = this._.nodeType(this.layer("nodes")); 
    else elem = value;
    this._.nodes[id] = {
        parent: "",
        node: elem,
        id: id,
    };
    this.children.push(elem);

    let self = this;
    if (this._.fromExistedElem) {
        this._.nodes[id].preIn = function() {
            elem.attachTo(self.layer("nodes"));
            if (!elem.isAnimating()) elem.startAnimate(self);
        }
        this._.nodes[id].in = SDHelper.emptyFunc;
    } else if (this._.fromExistedValue) {
        this._.nodes[id].preIn = function() {
            elem.endAnimate();
            elem.opacity(0);
        }
        this._.nodes[id].in = function() {
            elem.startAnimate(self);
            if (elem !== value) elem.fromExisted().value(value);
            elem.opacity(1);
        }
    } else {
        this._.nodes[id].preIn = function() {
            elem.endAnimate();
            if (elem !== value) elem.value(value);
            elem.opacity(0);
        }
        this._.nodes[id].in = function() {
            elem.startAnimate(self);
            elem.opacity(1);
        }
    }
    this._.fromExistedElem = false;
    this._.fromExistedValue = false;
    return this;
}

function newLink(x, y, value = null) {
    let links = this._.links;
    let group = this.layer("links");
    value = SDHelper.any2Slide(this, value);
    this._.nodes[y].parent = x;
    let idx = encode(x, y);
    let link = {
        link: this._.linkType(group),
        parent: x,
        id: y,
    }
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
    link.link.opacity(0);
    this._.nodes[y].preIn();
    this.update();
    this._.nodes[y].in();
    link.link.startAnimate(this);
    link.link.opacity(1);

    this._.nodes[y].preIn = SDHelper.emptyFunc;
    this._.nodes[y].in = SDHelper.emptyFunc;
    return this;
}