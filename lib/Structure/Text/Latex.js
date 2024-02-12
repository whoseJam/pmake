import { Node } from "../../Node/Node_";
import { Line } from "../Basic/Line";
import { Text } from "../Basic/Text";
import { Path } from "../Basic/Path";
import { Group } from "../Group";
import * as Curve from "../Basic/Curve";
import * as Common from "../Common";
import { Interact } from "../../Interact/Interact";
import { Traiter } from "../../Utility/TypeTrait";
import { equal } from "../../Utility/Math";
import * as Rule from "../../Rule/Rule";

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function Latex(node) {
    let self = {};

    self = Node(self, node);
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    
    self.set("fontSize", 30);
    self.set("elementsDict", {});
    self.set("elements", []);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.fontSize = fontSize;
    self.push = push;
    self.sup = sup;
    self.sub = sub;
    self.frac = frac;
    self.lfloor = lfloor;
    self.rfloor = rfloor;
    self.equiv = equiv;
    self.opacity = Common.opacity;
    self.color = color;
    self.element = element;
    self.swap = swap;
    self.insert = insert;
    self.insertAfter = insertAfter;
    self.erase = erase;
    self.replace = replace;
    self.remove = Common.remove;
    self.update = update;
    self.type = () => { return "Latex"; }

    self.preIn = kvset.call(self, "preIn", () => {});
    self.in = kvset.call(self, "in", (elem) => {
        elem.opacity(0)
            .startAnimate(self)
            .opacity(1);
    });
    self.preOut = kvset.call(self, "preOut", () => {});
    self.out = kvset.call(self, "out", (elem) => {
        elem.opacity(0).remove();
    });

    self.g().attr("name", "Latex");

    return self;
}

function element(id) {
    if (typeof(id) === "string") {
        let elems = this.get("elementsDict");
        return elems[id].value;
    } else if (typeof(id) === "number") {
        let elems = this.get("elements");
        return elems[id];
    } else throw new Error("invalid arguments");
}

function color() {
    let len = arguments.length;
    let last = arguments[len - 1];
    let args = [];
    for (let i = 0; i < len - Traiter.isColor(last); i++)
        args.push(arguments[i]);
    if (Traiter.isColor(last)) {
        let elem = this.element.apply(this, args);
        elem.color(last);
        return this;
    }
    return this.element.apply(this, args).color();
}

function fontSize(fs) {
    let ofs = this.get("fontSize");
    if (fs === undefined)
        return ofs;
    if (equal(fs, ofs)) return this;
    this.set("fontSize", fs);
    this.update();
    return this;
}

function update() {
    let fs = this.fontSize();
    this.set("last", {
        supX: this.x(), midX: this.x(), subX: this.x(),
        supY: this.y(), midY: this.cy(), subY: this.my(),
        fontSize: fs
    });
    let elems = this.get("elements");
    for (let i = 0; i < elems.length; i++) {
        elems[i].parent = null;
        elems[i].latexRule();
        elems[i].parent = this;
    }

    let minX = this.x(), maxX = this.x();
    for (let id in elems) {
        let elem = elems[id];
        minX = Math.min(elem.x(), minX);
        maxX = Math.max(elem.mx(), maxX);
    }
    this.set("width", maxX - minX); this.call("onWidth");
    this.set("height", fs); this.call("onHeight");

    this.isDirty = false;
    this.children.update();
    return this;
}

function swap(l, r) {
    let elems = this.get("elements");
    let via = elems[l];
    elems[l] = elems[r];
    elems[r] = via;
    this.update();
    return this;
}

function erase(i) {
    let elem;
    if (typeof(i) === "number") {
        let elems = this.get("elements");
        let dict = this.get("elementsDict");
        elem = elems[i];
        if (elem.latexKey)
            delete dict[elem.latexKey];
        elems.splice(i, 1);
    } else if (typeof(i) === "string") {
        let elems = this.get("elements");
        let dict = this.get("elementsDict");
        elem = dict[i];
        for (let i = 0; i < elems.length; i++)
            if (elems[i] === elem) {
                elems.splice(i, 1);
                break;
            }
        delete dict[elem.latexKey];
    } else throw new Error("invalid arguments");
    this.children.erase(elem);
    this.preOut()(elem);
    this.update();
    this.out()(elem);
    return this;
}

function insert(idx, funcname, args) {
    this.insertAfter(idx - 1, funcname, args);
    return this;
}

function insertAfter(idx, funcname, args) {
    let elems = this.get("elements");
    let len = elems.length;
    this[funcname].apply(this, args);
    let last = elems[len];
    for (let i = len; i > idx; i--) elems[i] = elems[i - 1];
    elems[idx + 1] = last;
    this.update();
    return this;
}

function replace(idx, funcname, args) {
    this.insertAfter(idx, funcname, args);
    this.erase(idx);
    return this;
}

function trans(arg) {
    if (typeof(arg) === "object") return arg;
    return Text(this, arg);
}

function push() {
    let elem, id = undefined;
    if (arguments.length === 2) {
        id = arguments[0];
        elem = trans.call(this, arguments[1]);
    } else if (arguments.length === 1) {
        elem = trans.call(this, arguments[0]);
    }
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Next(this, elem);
    elem.latexRule = rule;
    elem.latexKey = id;
    putInElems.call(this, elem);
    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function sup() {
    let elem, id = null;
    if (arguments.length === 1) {
        elem = trans.call(this, arguments[0]);
    } else if (arguments.length === 2) {
        id = arguments[0];
        elem = trans.call(this, arguments[1]);
    }
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Superscript(this, elem);
    elem.latexRule = rule;
    elem.latexKey = id;
    putInElems.call(this, elem);
    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function sub() {
    let elem, id = null;
    if (arguments.length === 1) {
        elem = trans.call(this, arguments[0]);
    } else if (arguments.length === 2) {
        id = arguments[0];
        elem = trans.call(this, arguments[1]);
    }
    if (id) putInDict.call(this, id, math);
    let rule = Rule.Latex.Subscript(this, math);
    elem.latexRule = rule;
    elem.latexKey = id;
    putInElems.call(this, elem);
    this.preIn().call(elem);
    this.update();
    this.preIn().call(elem);
    return this;
}

function frac() {
    let line, sup, sub, id;
    if (arguments.length === 2) {
        sup = trans.call(this, arguments[0]);
        sub = trans.call(this, arguments[1]);
    } else if (arguments.length === 3) {
        id = arguments[0];
        sup = trans.call(this, arguments[1]);
        sub = trans.call(this, arguments[2]);
    }
    line = Line(this).x1(0).y1(0).x2(100).y2(0);
    let elem = Group(node).push(sup).push(sub).push(line);
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Frac(this, sup, sub, line);
    elem.latexRule = rule;
    elem.latexKey = id;
    putInElems.call(this, elem);
    this.preIn()(math);
    this.update();
    this.in()(math);
    return this;
}

function lfloor() {
    let elem, id;
    elem = Path(this).data([
        {x: 0, y: 0},
        {x: 0, y: 12},
        {x: 2, y: 12}
    ]).curve(Curve.Linear());
    if (arguments.length === 1) id = arguments[0];
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Lfloor(this, elem);
    elem.latexRule = rule;
    elem.latexKey = id;
    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function rfloor() {
    let elem, id;
    elem = Path(this).data([
        {x: 2, y: 0},
        {x: 2, y: 12},
        {x: 0, y: 12}
    ]).curve(Curve.Linear());
    if (arguments.length === 1) id = arguments[0];
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Lfloor(this, elem);
    elem.latexRule = rule;
    elem.latexKey = id;
    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function equiv() {
    let elem, id;
    let l1 = Line(this).x1(0).y1(0).x2(100).y2(0);
    let l2 = Line(this).x1(0).y1(0).x2(100).y2(0);
    let l3 = Line(this).x1(0).y1(0).x2(100).y2(0);
    elem = Group(this).push(l1).push(l2).push(l3);
    if (arguments.length === 1) id = arguments[0];
    if (id) putInDict.call(this, id, elem);
    let rule = Rule.Latex.Equiv(this, l1, l2, l3);
    elem.latexRule = rule;
    elem.latexKey = id;
    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function putInDict(name, value) {
    let dict = this.get("elementsDict");
    if (dict[name] !== undefined)
        throw new Error(name + " has been used");
    dict[name] = value;
}

function putInElems(value) {
    let elems = this.get("elements");
    elems.push(value);
    this.children.push(value);
}

function extWidth(width) {
    let ow = this.width();
    let ofs = this.fontSize();
    if (ow > 0) {
        let fs = width / ow * ofs;
        this.fontSize(fs);
    }
}

function extHeight(height) {
    let oh = this.height();
    let ofs = this.fontSize();
    if (oh > 0) {
        let fs = height / oh * ofs;
        this.fontSize(fs);
    }
}