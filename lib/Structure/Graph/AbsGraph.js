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
        let elem = this.element(v1);
        if (this._.fromExistedValue)
            elem.fromExisted();
        elem.value(v2);
        this._.fromExistedValue = false;
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2)) {
        let idx = encode(v1, v2);
        if (this._.links[idx] != undefined)
            return this._.links[idx].link.value();
        let elem = this.element(v1);
        if (this._.fromExistedValue)
            elem.fromExisted();
        elem.value(Text(this, v2));
        this._.fromExistedValue = false;
        return this;
    }
    throw new Error("invalid arguments");
}
function value3(x, y, v) {
    v = SDHelper.any2Slide(v);
    let elem = this._.links[encode(x, y)].link;
    if (this._.fromExistedValue)
        elem.fromExisted();
    elem.value(v);
    this._.fromExistedValue = false;
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

function newNode(id, value, col) {
    let elem;
    if (value === undefined) value = id;
    if (this._.nodeType) value = SDHelper.any2Slide(this, value);
    if (this._.fromExistedElem) elem = value;
    else if (this._.nodeType) elem = this._.nodeType(this.layer("nodes"));
    else elem = value;
    this._.nodes[id] = {
        node: elem,
        id: id,
    }
    this.children.push(elem);
    this.extNewNode(this._.nodes[id], col);

    if (this._.fromExistedElem) {
        elem.attachTo(self.layer("nodes"));
        elem.startAnimate(this);
        this.update();
    } else if (this._.fromExistedValue) {
        elem.opacity(0);
        this.update();
        elem.startAnimate(this);
        if (elem !== value) elem.fromExisted().value(value);
        elem.opacity(1);
    } else {
        if (elem !== value) elem.value(value);
        elem.opacity(0);
        this.update();
        elem.startAnimate(this);
        elem.opacity(1);
    }
    this._.fromExistedElem = false;
    this._.fromExistedValue = false;
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
    };
    this.extNewLink(link);
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
    link.link.opacity(0);
    this.update();
    link.link.startAnimate(this);
    link.link.opacity(1);
    return this;
}

