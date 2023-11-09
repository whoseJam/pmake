import { Interact } from "../../Interact/Interact";
import { Traiter } from "../../Utility/TypeTrait";
import { Color } from "../../Utility/Color";
import { Node } from "../../Node/Node";
import { Text } from "../Basic/Text";
import { Rect } from "../Basic/Rect";
import * as Common from "../Common";

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function Code(node) {
    let self = {};
    
    self = Node(self, node, "Code");
    self.set("fontSize", 20);
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));

    let rect = Rect(self);
    rect.x(0).y(0);
    rect.width(0);
    rect.height(0);
    rect.color(Color.BLUE);
    self.children.push("highlight", rect)
    self.set("codes", []);
    self.set("l", null);
    self.set("r", null);
    self.set("start", 1);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.code = code;
    self.push = push;
    self.erase = erase;
    self.pop = pop;
    self.start = start;
    self.end = end;
    self.idx = idx;
    self.row = row;
    self.fontSize = fontSize;
    self.highlight = highlight;
    self.dehighlight = dehighlight;
    self.opacity = Common.opacity;
    self.color = color;
    self.light = light;
    self.length = length;
    self.l = l;
    self.r = r;
    self.update = update;
    self.remove = Common.remove;

    self.preIn = kvset.call(self, "preIn", () => {});
    self.in = kvset.call(self, "in", (elem) => {
        elem.opacity(0)
            .startAnimate(self)
            .opacity(1);
    });
    self.preOut = kvset.call(self, "preOut", () => {});
    self.out = kvset.call(self, "out", (elem) => {
        elem.opacity(0).remove();
    })

    return self;
}

function code(source) {
    let codes = this.get("codes");
    for (let i in codes) {
        this.children.erase(codes[i]);
        this.preOut()(codes[i]);
        this.out()(codes[i]);
    }
    this.set("codes", []);
    
    let ans = "";
    for (let i = 0; i < source.length; i++) {
        if (source[i] === "\n") {
            if (ans !== "") this.push(ans);
            ans = "";
        } else ans += source[i];
    }
    if (ans.length > 0) this.push(ans);
    return this;
}

function push(code) {
    let fs = this.fontSize();
    if (Traiter.isText(code))
        code = Text(this, code);
    code.fontSize(fs);
    let codes = this.get("codes");

    codes.push(code);
    this.children.push(code);
    this.preIn()(code);
    this.update();
    this.in()(code);

    let width = Math.max(this.width(), code.width())
    let height = this.height() + code.height();
    this.set("width", width); this.call("onWidth");
    this.set("height", height); this.call("onHeight");
    return this;
}

function pop() {
    this.erase(this.end());
    return this;
}

function erase(i) {
    i = this.idx(i);
    let codes = this.get("codes");
    let code = codes[i];
    codes.splice(i, 1);
    this.children.erase(code);
    this.preOut()(code);
    this.update();
    this.out(code);

    let width = 0, height = 0;
    for (let i in codes) {
        width = Math.max(codes[i].width(), width);
        height += codes[i].height();
    }
    this.set("width", width); this.call("onWidth");
    this.set("height", height); this.call("onHeight");
    return this;
}

function row(i) {
    let codes = this.get("codes");
    return codes[this.idx(i)];
}

function start(start) {
    if (start === undefined)
        return this.get("start");
    this.set("start", start);
    return this;
}

function end() {
    return this.start() + this.length() - 1;
}

function idx(i) {
    return i - this.start();
}

function highlight(l, r) {
    if (typeof(l) === "object") {
        let args = arguments[0];
        if (args.length === 1) l = r = args[0];
        else { l = args[0]; r = args[1]; }
    } else if (arguments.length === 1)
        l = r = arguments[0];
    let last = this.l();
    let light = this.children.child("highlight");
    this.set("l", l, true);
    this.set("r", r, true);
    if (!last) {
        let eleml = this.row(l);
        let elemr = this.row(r);
        light.endAnimate();
        light.after(this);
        light.x(eleml.x()).width(this.width());
        light.y(eleml.y()).height(elemr.my() - eleml.y());
        light.opacity(0);
        light.startAnimate(this);
        light.opacity(1);
    } else this.update();
    return this;
}

function dehighlight() {
    this.set("l", null, true);
    this.set("r", null, true);
    let light = this.children.child("highlight");
    light.opacity(0);
    return this;
}

function fontSize(fs) {
    if (fs === undefined)
        return this.get("fontSize");
    this.set("fontSize", fs);
    let codes = this.get("codes");
    let width = 0;
    let height = 0;
    codes.forEach((code) => {
        code.fontSize(fs);
        height += code.height();
        width = Math.max(width, code.width());
    });
    this.set("width", width); this.call("onWidth");
    this.set("height", height); this.call("onHeight");
    this.update();
    return this;
}

function color(color) {
    let codes = this.get("codes");
    for (let i in codes)
        codes[i].color(color);
    return this;
}

function light() {
    return this.children.child("highlight");
}

function length() {
    let codes = this.get("codes");
    return codes.length;
}

function update() {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let fs = this.fontSize();
    let codes = this.get("codes");
    codes.forEach((code) => {
        code.parent = null;
        code.fontSize(fs).x(x).y(y);
        code.parent = this;
        y += code.height();
    });
    let l = this.l();
    let r = this.r();
    if (l && r) {
        let light = this.children.child("highlight");
        light.parent = null;
        light.x(this.row(l).x());
        light.width(width);
        light.y(this.row(l).y());
        light.height(
            this.row(r).my() - 
            this.row(l).y()
        );
        light.parent = this;
    }
    this.isDirty = false;
    this.children.update();
}

function extWidth(width) {
    let codes = this.get("codes");
    let ow = 0, oh = 0, ofs = this.fontSize();
    for (let i in codes) {
        ow = Math.max(codes[i].width(), ow);
        oh += codes[i].height();
    }
    if (ow === 0) {
        oh = 0;
        for (let i in codes) {
            codes[i].fontSize(20);
            ow = Math.max(codes[i].width(), ow);
            oh += codes[i].height();
        }
        if (ow === 0 || oh === 0) { ow = 1; oh = ofs = 0; }
    }
    let fs = width / ow * ofs;
    let height = width / ow * oh;
    this.set("fontSize", fs);
    this.set("height", height); this.call("onHeight");
}

function extHeight(height) {
    let codes = this.get("codes");
    let ow = 0, oh = 0, ofs = this.fontSize();
    for (let i in codes) {
        ow = Math.max(codes[i].width(), ow);
        oh += codes[i].height();
    }
    if (ow === 0) {
        oh = 0;
        for (let i in codes) {
            codes[i].fontSize(20);
            ow = Math.max(codes[i].width(), ow);
            oh += codes[i].height();
        }
        if (ow === 0 || oh === 0) { ow = 1; oh = ofs = 0; }
    }
    let fs = height / oh * ofs;
    let width = height / oh * ow;
    this.set("fontSize", fs);
    this.set("width", width); this.call("onWidth");
}

function l() {
    return this._.l;
}

function r() {
    return this._.r;
}