import { CenterFixAspect } from "@/Rule/Center";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";
import { toNode } from "@/Utility/Tool";
import { svg } from "@/Interact/Svg";

/**
 * @class BaseElement
 * @description 元素/节点类的基类
 */
export class BaseElement extends SDNode {
    /**
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.newLayer("underBackground");
        this.newLayer("background");

        this.member.new("x", 0);
        this.member.new("y", 0);
        this.member.new("width", 40);
        this.member.new("height", 40);
        this.member.new("rate", 1.2);
        this.member.new("value", undefined);
    }

    x(x) {
        if (x === undefined) {
            return this.member.get("x");
        }
        this.member.setByEqual("x", x);
        this.tryUpdate();
        return this;
    }

    y(y) {
        if (y === undefined) {
            return this.member.get("y");
        }
        this.member.setByEqual("y", y);
        this.tryUpdate();
        return this;
    }

    width(width) {
        if (width === undefined) {
            return this.member.get("width");
        }
        this.member.setByEqual("width", width);
        this.tryUpdate();
        return this;
    }

    height(height) {
        if (height === undefined) {
            return this.member.get("height");
        }
        this.member.setByEqual("height", height);
        this.tryUpdate();
        return this;
    }

    /**
     * @overload
     * @param {number} rate 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    rate(rate) {
        if (rate === undefined) {
            return this.member.get("rate");
        }
        this.member.set("rate", rate);
        this.tryUpdate();
        return this;
    }

    drop() {
        const value = this.child("value");
        this.children.erase(value);
        value.attachTo(svg());
        return value;
    }

    /**
     * @overload
     * @param {SDNode} value 
     * @param {(parent: SDNode, child: SDNode) => void} rule 
     * @returns {this}
     * @overload
     * @param {SDNode} value
     * @returns {this}
     * @overload
     * @returns {SDNode}
     */
    value(value, rule) {
        if (value === undefined) {
            return this.member.get("value");
        }
        rule = rule ? rule : CenterFixAspect(this.member.get("rate"));
        value = toNode(this, value);
        const ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        if (!value) return this;
        value._.enter = (node, move) => {
            node.attachTo(this);
            node.after(this);
            node.opacity(0);
            move();
            node.startAnimate(this);
            node.opacity(1);
        };
        this.children.push("value", value, rule);
        this.tryUpdate();
        return this;
    }

    /**
     * @returns {number}
     */
    intValue() {
        const value = this.child("value");
        if (!value) return 0;
        if ("text" in value) return +value.text();
        throw new Error("Mismatch Function");
    }

    /**
     * @overload
     * @param {SDNode} value 
     * @param {(parent: SDNode, child: SDNode) => void} rule 
     * @returns {this}
     * @overload
     * @param {SDNode} value
     * @returns {this}
     */
    valueFromExist(value, rule) {
        rule = rule ? rule : CenterFixAspect(this._.rate);
        const ovalue = this.children.erase("value");
        console.log("ovalue=", ovalue);
        if (ovalue) ovalue.startAnimate(this).opacity(0).remove();
        value._.enter = (node, move) => {
            node.startAnimate(this);
            node.attachTo(this);
            move();
            node.opacity(1);
        };
        this.children.push("value", value, rule);
        this.tryUpdate();
        return this;
    }

    /**
     * @overload
     * @param {string|{main: string, border: string}} color 
     * @returns {this}
     * @overload
     * @returns {{main: string, border: string}}
     */
    color(color) {
        const back = this.child("background");
        if (color === undefined) return back.color();
        back.color(color);
        return this;
    }

    /**
     * @overload
     * @param {string} fill 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    fill(fill) {
        const back = this.child("background");
        if (fill === undefined) return back.fill();
        back.fill(fill);
        return this;
    }

    /**
     * @overload
     * @param {number} fillOpacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fillOpacity(fillOpacity) {
        const back = this.child("background");
        if (fillOpacity === undefined) return back.fillOpacity();
        back.fillOpacity(fillOpacity);
        return this;
    }

    /**
     * @overload
     * @param {string} stroke 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    stroke(stroke) {
        const back = this.child("background");
        if (stroke === undefined) return back.stroke();
        back.stroke(stroke);
        return this;
    }

    /**
     * @overload
     * @param {number} strokeOpacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeOpacity(strokeOpacity) {
        const back = this.child("background");
        if (strokeOpacity === undefined) return back.strokeOpacity();
        back.strokeOpacity(strokeOpacity);
        return this;
    }

    /**
     * @overload
     * @param {number} strokeWidth 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeWidth(strokeWidth) {
        const back = this.child("background");
        if (strokeWidth === undefined) return back.strokeWidth();
        back.strokeWidth(strokeWidth);
        return this;
    }

    update() {
        super.update();
    }
}