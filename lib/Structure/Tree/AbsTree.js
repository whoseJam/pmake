import { SDHelper } from "../../Utility/SDHelper";
import { Text } from "../Basic/Text";

export function AbsTree(self) {
    self.fromExistedElem = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedElem", false);
    self.fromExistedValue = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedValue", false);
    self.element = element;
    self.value = value;
    self.color = color;
    self.opacity = opacity;
    self.father = father;
    self.depth = depth;
    self.stratify = stratify;
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
    if (id === undefined) {
        for (let id in this._.nodes) {
            let node = this._.nodes[id];
            if (node.parent === "") return node.id;
        }
        return null;
    }
    this.newNode(id, value);
    this._.nodes[id].preIn();
    this.update();
    this._.nodes[id].in();
    this._.nodes[id].preIn = SDHelper.emptyFunc;
    this._.nodes[id].in = SDHelper.emptyFunc;
    return this;
}

function link(x, y, value = null) {
    let newRoot = (this.root() === y);
    if (this._.nodes[y] === undefined) this.newNode(y);
    if (this._.nodes[x] === undefined) this.newNode(x);
    if (newRoot) {
        this._.nodes[x].preIn();
        this._.nodes[x].parent = "";
    }
    this.newLink(x, y, value);
    if (newRoot) {
        this._.nodes[x].in();
        this._.nodes[x].preIn = SDHelper.emptyFunc;
        this._.nodes[x].in = SDHelper.emptyFunc;
    }
    return this;
}

function cut(x, y) {
    let link = this._.links[SDHelper.encode(x, y)].link;
    this.children.erase(link);
    delete this._.links[SDHelper.encode(x, y)];
    link.opacity(0).remove();
    console.log("cut x=", x, "y=", y);
    return this;
}

function father(id) {
    let nodes = this.get("nodes");
    let node = nodes[id];
    if (node.parent !== "") return node.parent;
    return null;
}

function depth() {
    let root = this.stratify();
    if (!root) return 0;
    return root.height;
}

function element1(nodeId) {
    if (typeof(nodeId) === "string" || typeof(nodeId) === "number")
        return this._.nodes[nodeId].node;
    throw new Error("invalid arguments");
}
function element2(v1, v2) {
    return this._.links[SDHelper.encode(v1, v2)].link;
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
        let elem = this.element(v1);
        if (this._.fromExistedValue)
            elem.fromExisted();
        elem.value(v2);
        this._.fromExistedValue = false;
        return this;
    } else if (SDHelper.isText(v1) && SDHelper.isText(v2)) {
        let idx = SDHelper.encode(v1, v2);
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
    let elem = this._.links[SDHelper.encode(x, y)].link;
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

function stratify() {
    let root;
    let nodes = this._.nodes;
    let pool = {};
    console.log("nodes=", nodes);
    for (let id in nodes)
        pool[id] = {
            children: [],
            data: nodes[id],
            depth: 0,
            height: 0,
            id: String(id),
            parent: null,
        }
    for (let id in nodes) {
        if (nodes[id].parent === "") root = id;
        else {
            let parent = pool[nodes[id].parent];
            let child = pool[id];
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
    if (!root) return null;
    dfs(pool[root]);
    return pool[root];
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
    this.extNewNode(elem, arguments);

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
    let idx = SDHelper.encode(x, y);
    let elem = this._.linkType(group);
    let link = {
        link: elem,
        parent: x,
        id: y,
    }
    elem.value(value);
    links[idx] = link;
    this.children.push(elem);
    this.extNewLink(elem, arguments);

    elem.opacity(0);
    this._.nodes[y].preIn();
    this.update();
    this._.nodes[y].in();
    link.link.startAnimate(this);
    link.link.opacity(1);

    this._.nodes[y].preIn = SDHelper.emptyFunc;
    this._.nodes[y].in = SDHelper.emptyFunc;
    return this;
}