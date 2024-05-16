import { ArrayBase } from "@/Node/ArrayBase";
import { Context } from "@/Animate/Context";
import { Color } from "@/Utility/Color";
import { D3Layer } from "@/Node/D3Layer";
import { Rect } from "@/Node/Basic/Rect";
import { SDNode } from "@/Node/Node";
import { toNode } from "@/Utility/Tool";

/**
 * @class Code
 */
export class Code extends ArrayBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("Code");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.fontSize = 20;
        this._.start = 1;
        this.children.push(
            "focus",
            new Rect(this).color(Color.BLUE).opacity(0),
            (parent, child) => {
                if (typeof(parent.l()) !== "number") return;
                const elementL = parent.element(parent.l());
                const elementR = parent.element(parent.r());
                child.x(elementL.x());
                child.y(elementL.y());
                child.width(parent.width());
                child.height(elementR.my() - elementL.y());
            }
        );
        this.newLayer("elements");
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        if (!this._.width) return this;
        const k = width / this._.width;
        const fontSize = this.fontSize();
        this.fontSize(fontSize * k);
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck("q");
        if (height === undefined) return this._.height;
        if (!this._.height) return this;
        const k = height / this._.height;
        const fontSize = this.fontSize();
        this.fontSize(fontSize * k);
        return this;
    }

    /**
     * @overload
     * @param {number} fontSize 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fontSize(fontSize) {
        this.dirtyCheck("q");
        if (fontSize === undefined) return this._.fontSize;
        this._.fontSize = fontSize;
        this.dirty(this, "R");
        return this;
    }

    /**
     * @param {number} idx 
     * @param {string} value 
     * @returns 
     */
    insert(idx, value = "") {
        const elem = toNode(this.layer("elements"), value);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this);
            elem.opacity(1);
        }
        this.dirty(this, "U");
        this.insertByArrayBase(idx, elem);
        return this;
    }
    
    /**
     * 设置代码块的内容，代码块原本的内容会被覆盖掉
     * @param {string} source 
     * @returns {this}
     */
    code(source) {
        for (let i = this.end(); i >= this.start(); i--)
            this.erase(i);
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

    /**
     * @overload
     * @param {number} l 
     * @param {number} r 
     * @returns {this}
     * @overload
     * @param {number} line
     * @returns {this}
     * @overload
     * @param {null} status
     * @returns {this}
     */
    focus(l, r) {
        const focus = this.child("focus");
        if (l === null) {
            this._.l = this._.r = null;
            focus.opacity(0);
            return this;
        } else if (arguments.length === 1) l = r = arguments[0];
        this._.l = l;
        this._.r = r;
        if (!focus.opacity()) {
            focus._.enter = (elem, move) => {
                const context = new Context(this);
                elem.startAnimate(context.tillc(0, 0));
                move();
                elem.startAnimate(context.tillc(0, 1));
                elem.opacity(1);
            };
        }
        this.dirty(this, "R");
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
        this._.width = width;
        this._.height = height;
        this.postUpdate();
        return this;
    }

    /**
     * 获取代码高亮的起始行
     * @returns {number}
     */
    l() {
        return this._.l;
    }

    /**
     * 获取代码高亮的终止行
     * @returns {number}
     */
    r() {
        return this._.r;
    }
}