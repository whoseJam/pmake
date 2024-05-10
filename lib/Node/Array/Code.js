import { Context } from "../../Animate/Context";
import { Color } from "../../Utility/Color";
import { Const } from "../../Utility/Const";
import { toNode } from "../../Utility/Tool";
import { Rect } from "../Basic/Rect";
import { ArrayBase } from "./ArrayBase";

export class Code extends ArrayBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Code");
        this.newLayer("focus");
        this.newLayer("elements");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.fontSize = 20;
        this._.start = 1;

        let focus = new Rect(this.layer("focus"));
        focus.color(Color.BLUE).opacity(0);
        this.childAs("focus", focus);
    }

    insert(idx, value = "") {
        let elem = toNode(this, value);
        elem.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.after(0).opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(Const.DirtyChannel.width | Const.DirtyChannel.height);
        return this;
    }

    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.opacity(0).remove();
        this.dirty(Const.DirtyChannel.width | Const.DirtyChannel.height);
        return this;
    }
    
    code(source) {
        for (let i = this.end(); i >= this.start(); i--)
            this.erase(i);
        let codes = this._.elements;
        let ans = "";
        for (let i = 0; i < source.length; i++) {
            if (source[i] === "\n") {
                if (ans != "") this.push(ans);
                ans = "";
            } else ans += source[i];
        }
        if (ans.length > 0) this.push(ans);
        return this;
    }

    focus(l, r) {
        const focus = this.child("focus");
        if (l === null) {
            this._.l = this._.r = null;
            focus.opacity(0);
            return this;
        } else if (arguments.length === 1)
            l = r = arguments[0];
        this._.l = l;
        this._.r = r;
        const move = () => {
            const l = this.element(this._.l);
            const r = this.element(this._.r);
            focus.x(l.x());
            focus.y(l.y());
            focus.width(this.width());
            focus.height(r.my() - l.y());
        };
        const context = new Context(this);
        if (!focus.opacity()) {
            focus.startAnimate(context.tillc(0, 0));
            move();
            focus.startAnimate(context.tillc(0, 1));
            focus.opacity(1);
        } else move();
        return this;
    }

    width(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        if (!this._.width) return this;
        const k = width / this._.width;
        const fontSize = this.fontSize();
        this.fontSize(fontSize * k);
        return this;
    }

    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        if (!this._.height) return this;
        const k = height / this._.height;
        const fontSize = this.fontSize();
        this.fontSize(fontSize * k);
        return this;
    }

    fontSize(fontSize) {
        this.dirtyCheck();
        if (fontSize === undefined) return this._.fontSize;
        this._.fontSize = fontSize;
        this.dirty();
        return this;
    }

    update() {
        this.preUpdate();
        const x = this.x();
        let y = this.y();
        let width = 0;
        let height = 0;
        const fontSize = this.fontSize();
        const elements = this._.elements;
        for (let element of elements) {
            const move = () => {
                element.fontSize(fontSize);
                element.x(x).y(y);
            };
            if (element._.enter) {
                element._.enter(element, move);
                element._.enter = undefined;
            } else move();
            y += element.height();
            width = Math.max(width, element.width());
            height += element.height();
        }
        let l = this.l();
        let r = this.r();
        if (l && r) {
            const focus = this.child("focus");
            const move = () => {
                const l = this.element(this._.l);
                const r = this.element(this._.r);
                focus.x(l.x());
                focus.y(l.y());
                focus.width(width);
                focus.height(r.my() - l.y());   
            };
            move();
        }
        this._.width = width;
        this._.height = height;
        this.postUpdate();
        return this;
    }

    l() {
        return this._.l;
    }

    r() {
        return this._.r;
    }
}