import { Traiter } from "../../Utility/TypeTrait";

export function encode(x, y) {
    return x + "%%" + y;
}

export function AbsGraph(self) {
    self.linkType = linkType;
    self.nodeType = nodeType;
    self.element = element;
    self.value = value;
    self.color = color;
    self.opacity = opacity;

    self._.mode = "strong";
    self.mode = mode;

    self.nodePreIn = kvset.call(self, "nodePreIn", () => {});
    self.nodeIn = kvset.call(self, "nodeIn", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.nodePreOut = kvset.call(self, "nodePreOut", () => {});
    self.nodeOut = kvset.call(self, "nodeOut", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    });
    self.linkPreIn = kvset.call(self, "linkPreIn", () => {});
    self.linkIn = kvset.call(self, "linkIn", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.linkPreOut = kvset.call(self, "linkPreOut", () => {});
    self.linkOut = kvset.call(self, "linkOut", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    })

    return self;
}


function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

function linkType(type) {
    if (type === undefined)
        return this.get("linkType");
    this.set("linkType", type);
    return this;
}

function nodeType(type) {
    if (type === undefined)
        return this.get("nodeType");
    this.set("nodeType", type);
    return this;
}

function element() {
    let nodes = this.get("nodes");
    let links = this.get("links");
    if (arguments.length === 1) {
        let node = arguments[0];
        return nodes[node].node;
    } else if (arguments.length === 2) {
        if (arguments[0] === "node") {
            let node = arguments[1];
            return nodes[node].node;
        } else {
            let x = arguments[0];
            let y = arguments[1];
            return links[encode(x, y)][0].link;
        }
    } else if (arguments.length === 3) {
        if (arguments[0] === "link") {
            let x = arguments[1];
            let y = arguments[2];
            return links[encode(x, y)][0].link;
        } else {
            let x = arguments[0];
            let y = arguments[1];
            let idx = arguments[2];
            return links[encode(x, y)][idx].link;
        }
    } else if (arguments.length === 4) {
        let x = arguments[1];
        let y = arguments[2];
        let idx = arguments[3];
        return links[encode(x, y)][idx].link;
    }
    throw new Error("invalid arguments");
}

function mode(mode) {
    if (mode === undefined)
        return this._.mode;
    this._.mode = mode;
    return this;
}

function value() {
    let len = arguments.length;
    let last = arguments[len - 1];
    if (Traiter.isSlide(last)) {
        let args = [];
        for (let i = 0; i < len - 1; i++)
            args.push(arguments[i]);
        let elem = this.element.apply(this, args);
        elem.value(last);
        return this;
    } else {
        let elem = this.element.apply(this, arguments);
        return elem.value();
    }
}

function opacity() {
    let len = arguments.length;
    let last = arguments[len - 1];
    if (Traiter.isOpacity(last)) {
        if (arguments.length === 1) {
            Common.opacity.call(this, last);
        } else {
            let args = [];
            for (let i = 0; i < len - 1; i++)
                args.push(arguments[i]);
            let elem = this.element.apply(this, args);
            elem.opacity(last);
        }
        return this;
    } else {
        let elem = this.element.apply(this, arguments);
        return elem.opacity();
    }
}

function color() {
    let len = arguments.length;
    let last = arguments[len - 1];
    if (Traiter.isColor(last)) {
        if (arguments.length === 1) {
            let nodes = this.get("nodes");
            let links = this.get("links");
            for (let id in nodes)
                nodes[id].color(last);
            for (let id in links) 
                links[id].color(last);
        } else {
            let args = [];
            for (let i = 0; i < len - 1; i++)
                args.push(arguments[i]);
                let elem = this.element.apply(this, args);
                elem.color(last);
        }
        return this;
    } else {
        let elem = this.element.apply(this, arguments);
        return elem.color();
    }
}