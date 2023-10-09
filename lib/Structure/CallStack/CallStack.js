import { Node } from "../../Node/Node";
import { Code } from "../Text/Code";
import { Text } from "../Basic/Text";
import * as Common from "../Common";
import { Interact } from "../../Interact/Interact";
import { Rect } from "../Basic/Rect";

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function CallStack(node) {
    let self = {};

    self = Node(self, node);
    self.newLayer("rects");
    self.newLayer("funcs");
    self.newLayer("codes");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));

    self.set("fontSize", 30);
    self.set("funcs", []);
    self.set("codes", []);
    self.set("rects", []);
    self.set("start", 0);
    
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.fontSize = fontSize;
    self.highlight = highlight;
    self.enter = enter;
    self.exit = exit;
    self.code = code;
    self.func = func;
    self.start = start;
    self.idx = idx;
    self.update = update;
    self.remove = Common.remove;
    self.type = () => { return "CallStack"; };

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

    self.g().attr("name", "CallStack");

    return self;
}

function args2str(func) {
    let ans = func.name + "(";
    for (let i = 0; i < func.args.length; i++) {
        func.args[i].name;
        ans = ans + `${func.args[i].name}=${func.args[i].value}`;
        if (i + 1 < func.args.length) ans = ans + " ";
    }
    ans = ans + ")";
    return ans;
}

function enter(funcobj, source) {
    let fs = this.fontSize();
    let codes = this.get("codes");
    let funcs = this.get("funcs");
    let rects = this.get("rects");
    let len = funcs.length;
    if (len >= 1) {
        codes[len - 1].opacity(0);
        rects[len - 1].height(funcs[len - 1].height());
    }
    let func = Text(this.layer("funcs"), args2str(funcobj)).fontSize(fs);
    let code = Code(this.layer("codes")).fontSize(fs).code(source);
    let rect = Rect(this.layer("rects"));

    funcs.push(func); this.children.push(func);
    codes.push(code); this.children.push(code);
    rects.push(rect); this.children.push(rect);
    this.preIn()(func);
    this.preIn()(code);
    this.preIn()(rect);

    len = funcs.length;
    let width = 0, height = 0;
    for (let i = 0; i < len; i++) {
        width = Math.max(width, funcs[i].width());
        width = Math.max(width, codes[i].width());
        height += funcs[i].height();
        if (i === len - 1) height += codes[i].height();
    }
    this.set("width", width); this.call("on_width");
    this.set("height", height); this.call("on_height");

    this.update();
    this.in()(func);
    this.in()(code);
    this.in()(rect);
    return this;
}

function exit() {
    let codes = this.get("codes");
    let funcs = this.get("funcs");
    let rects = this.get("rects");
    let code = codes.pop(); this.children.erase(code);
    let func = funcs.pop(); this.children.erase(func);
    let rect = rects.pop(); this.children.erase(rect);
    this.preOut()(code);
    this.preOut()(func);
    this.preOut()(rect);
    this.update();
    this.out()(code);
    this.out()(func);
    this.out()(rect);

    let len = funcs.length;
    if (len >= 1) codes[len - 1].opacity(1);

    let width = 0, height = 0;
    for (let i = 0; i < len; i++) {
        width = Math.max(width, funcs[i].width());
        width = Math.max(width, codes[i].width());
        height += funcs[i].height();
        if (i === len - 1) height += codes[i].height();
    }
    this.set("width", width); this.call("on_width");
    this.set("height", height); this.call("on_height");
    return this;
}

function start(start) {
    if (start === undefined)
        return this.get("start");
    this.set("start", start);
    return this;
}

function idx(i) {
    return i - this.start();
}

function func(i) {
    let funcs = this.get("funcs");
    let len = funcs.length;
    if (i === undefined)
        return funcs[len - 1];
    return funcs[this.idx(i)];
}

function code(i) {
    let codes = this.get("codes");
    let len = codes.length;
    if (i === undefined)
        return codes[len - 1];
    return codes[this.idx(i)];
}

function highlight(l, r) {
    let code = this.code();
    if (typeof(l) === "object") {
        if (l.length === 2) code.highlight(l[0], l[1]);
        else code.highlight(l[0]);
    } else code.highlight(l, r);
    return this;
}

function fontSize(fs) {
    if (fs === undefined)
        return this.get("fontSize");
    this.set("fontSize", fs);
    let codes = this.get("codes");
    let funcs = this.get("funcs");
    let len = funcs.length;
    let width = 0, height = 0;
    for (let i = 0; i < len; i++) {
        codes[i].fontSize(fs);
        funcs[i].fontSize(fs);
        if (i === len - 1) height += codes[i].height();
        height += funcs[i].height();
        width = Math.max(width, funcs[i].width());
    }
    this.set("width", width); this.call("on_width");
    this.set("height", height); this.call("on_height");
    this.update();
    return this;
}

function extWidth(width) {
    let ofs = this.fontSize();
    let funcs = this.get("funcs");
    let codes = this.get("codes");
    let len = funcs.length;
    let ow = 0;
    for (let i = 0; i < len; i++) {
        ow = Math.max(ow, funcs[i].width());
        ow = Math.max(ow, codes[i].width());
    }
    if (ow === 0) return;
    let fs = width / ow * ofs;
    let height = width / ow * this.height();
    this.set("fontSize", fs);
    this.set("height", height); this.call("on_height");
}

function extHeight(height) {
    let ofs = this.fontSize();
    let funcs = this.get("funcs");
    let codes = this.get("codes");
    let len = funcs.length;
    let oh = 0;
    for (let i = 0; i < len; i++) {
        oh += funcs[i].height();
        if (i === len - 1) oh += codes[i].height();
    }
    if (oh === 0) return;
    let fs = height / oh * ofs;
    let width = height / oh * this.width();
    this.set("fontSize", fs);
    this.set("width", width); this.call("on_width");
}

function update() {
    let fs = this.fontSize();
    let codes = this.get("codes");
    let funcs = this.get("funcs");
    let rects = this.get("rects");
    let len = funcs.length;
    let width = this.width();
    let x = this.x(), y = this.y();
    for (let i = 0; i < len; i++) {
        codes[i].fontSize(fs);
        funcs[i].fontSize(fs);
        funcs[i].x(x).y(y);
        let height = funcs[i].height();
        if (i === len - 1) {
            codes[i].x(x).y(y + height);
            height += codes[i].height();
        }
        rects[i].x(x).y(y);
        rects[i].width(width);
        rects[i].height(height);
        y += height;
    }
    this.isDirty = false;
    this.children.update();
    return this;
}
